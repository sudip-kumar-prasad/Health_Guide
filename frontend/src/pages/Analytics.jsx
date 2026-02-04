import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { toast } from 'react-toastify';
import { FaChartBar, FaChartPie, FaChartLine, FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaStethoscope, FaUserMd } from 'react-icons/fa';

const Analytics = () => {
    // State to hold our data from server
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/symptoms/analytics', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: '500' }}>Loading analytics dashboard...</div>
            </div>
        );
    }

    // Check if we have no data
    if (!analytics || analytics.totalChecks === 0) {
        return (
            <div className="container" style={{ padding: '2rem', maxWidth: '1000px' }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    padding: '2rem 1rem'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>Health Analytics</h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748B' }}>Visualize your health trends and patterns</p>
                </div>
                <div className="card glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <FaChartBar style={{ fontSize: '3rem', color: '#94A3B8', marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#334155', fontWeight: '600' }}>No Data Available</h3>
                    <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                        Start checking your symptoms to generate data. Visual insights will appear here once you have some history.
                    </p>
                    <a href="/check-symptoms" className="btn btn-primary" style={{ borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '500', boxShadow: 'none' }}>
                        Start First Check
                    </a>
                </div>
            </div>
        );
    }

    // --- Prepare Data for Charts ---

    // 1. Prepare Symptom Data (Top 10)
    let symptomData = [];
    if (analytics.symptomFrequency) {
        const symptoms = Object.keys(analytics.symptomFrequency);
        for (let i = 0; i < symptoms.length; i++) {
            const name = symptoms[i];
            const count = analytics.symptomFrequency[name];
            symptomData.push({
                name: name,
                count: count
            });
        }

        // Sort by count (High to Low)
        symptomData.sort((a, b) => b.count - a.count);

        // Take only top 10
        symptomData = symptomData.slice(0, 10);
    }

    // 2. Prepare Severity Data
    let severityData = [];
    if (analytics.severityDistribution) {
        if (analytics.severityDistribution.Mild > 0) {
            severityData.push({ name: 'Mild', value: analytics.severityDistribution.Mild });
        }
        if (analytics.severityDistribution.Moderate > 0) {
            severityData.push({ name: 'Moderate', value: analytics.severityDistribution.Moderate });
        }
        if (analytics.severityDistribution.Severe > 0) {
            severityData.push({ name: 'Severe', value: analytics.severityDistribution.Severe });
        }
    }

    // 3. Prepare Trend Data
    let trendData = [];
    if (analytics.trendData) {
        const months = Object.keys(analytics.trendData);
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            const data = analytics.trendData[month];
            trendData.push({
                month: month,
                total: data.count,
                severe: data.severe
            });
        }
    }

    // 4. Find most frequent condition
    let topCondition = 'Insufficient Data';
    if (analytics.conditionFrequency) {
        const conditions = Object.keys(analytics.conditionFrequency);
        let maxCount = 0;

        for (let i = 0; i < conditions.length; i++) {
            const name = conditions[i];
            if (analytics.conditionFrequency[name] > maxCount) {
                maxCount = analytics.conditionFrequency[name];
                topCondition = name;
            }
        }
    }

    // 5. Calculate percentages
    let mildPercent = 0;
    let modPercent = 0;
    let severePercent = 0;

    if (analytics.totalChecks > 0) {
        if (analytics.severityDistribution?.Mild) {
            mildPercent = (analytics.severityDistribution.Mild / analytics.totalChecks) * 100;
            mildPercent = mildPercent.toFixed(0);
        }
        if (analytics.severityDistribution?.Moderate) {
            modPercent = (analytics.severityDistribution.Moderate / analytics.totalChecks) * 100;
            modPercent = modPercent.toFixed(0);
        }
        if (analytics.severityDistribution?.Severe) {
            severePercent = (analytics.severityDistribution.Severe / analytics.totalChecks) * 100;
            severePercent = severePercent.toFixed(0);
        }
    }

    // Recommended Doctor
    let doctorName = 'General Practitioner';
    if (analytics.recentRecords && analytics.recentRecords.length > 0) {
        // Check the first one
        const recent = analytics.recentRecords[0];
        if (recent.analysisResult && recent.analysisResult.recommendedDoctor) {
            doctorName = recent.analysisResult.recommendedDoctor;
        }
    }

    // Colors for charts
    const COLORS = {
        Mild: '#10B981',      // Green
        Moderate: '#F59E0B',  // Orange
        Severe: '#EF4444'     // Red
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1E293B', fontSize: '0.9rem' }}>{label}</p>
                    {payload.map((pld, index) => (
                        <p key={index} style={{ color: '#475569', fontSize: '0.85rem', margin: '0.1rem 0' }}>
                            <span style={{ color: pld.color || pld.fill, marginRight: '0.5rem' }}>●</span>
                            {pld.name}: <span style={{ fontWeight: '600', color: '#1E293B' }}>{pld.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
            <div className="animate-fade-in">
                {/* Header */}
                <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Analytics Dashboard</h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748B' }}>Overview of your health metrics and symptom history</p>
                </div>

                {/* Summary Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {/* Total Checks Card */}
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.6rem', background: '#EFF6FF', borderRadius: '0.75rem', color: '#3B82F6' }}>
                                <FaHeartbeat size={20} />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Total Checks</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B' }}>{analytics.totalChecks}</div>
                        <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>Lifetime records</div>
                    </div>

                    {/* Mild Cases Card */}
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.6rem', background: '#ECFDF5', borderRadius: '0.75rem', color: '#10B981' }}>
                                <FaCheckCircle size={20} />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Mild</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B' }}>{analytics.severityDistribution?.Mild || 0}</div>
                        <div style={{ fontSize: '0.85rem', color: '#10B981', marginTop: '0.25rem' }}>
                            {mildPercent}% of total
                        </div>
                    </div>

                    {/* Moderate Cases Card */}
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.6rem', background: '#FFF7ED', borderRadius: '0.75rem', color: '#F59E0B' }}>
                                <FaExclamationTriangle size={20} />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Moderate</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B' }}>{analytics.severityDistribution?.Moderate || 0}</div>
                        <div style={{ fontSize: '0.85rem', color: '#F59E0B', marginTop: '0.25rem' }}>
                            {modPercent}% of total
                        </div>
                    </div>

                    {/* Severe Cases Card */}
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.6rem', background: '#FEF2F2', borderRadius: '0.75rem', color: '#EF4444' }}>
                                <FaHeartbeat size={20} />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Severe</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B' }}>{analytics.severityDistribution?.Severe || 0}</div>
                        <div style={{ fontSize: '0.85rem', color: '#EF4444', marginTop: '0.25rem' }}>
                            {severePercent}% of total
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                    {/* Trend Chart */}
                    {trendData.length > 1 && (
                        <div className="card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: 'white', gridColumn: '1 / -1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaChartLine style={{ color: '#6366F1' }} /> Activity Trends
                                </h3>
                            </div>
                            <div style={{ height: '320px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                        <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Checks" />
                                        <Area type="monotone" dataKey="severe" stroke="#EF4444" strokeWidth={2} fill="none" name="Severe Cases" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Top Symptoms Bar Chart */}
                    {symptomData.length > 0 && (
                        <div className="card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaChartBar style={{ color: '#3B82F6' }} /> Common Symptoms
                            </h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={symptomData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} name="Frequency" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Severity Distribution Pie Chart */}
                    {severityData.length > 0 && (
                        <div className="card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaChartPie style={{ color: '#10B981' }} /> Severity Ratio
                            </h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={severityData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {severityData.map((entry, index) => (
                                                <Cell key={'cell-' + index} fill={COLORS[entry.name]} strokeWidth={2} stroke="#fff" />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Insights Panel */}
                <div style={{ marginTop: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '1rem' }}>Smart Insights</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                        <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ marginTop: '0.2rem', color: '#6366F1' }}><FaStethoscope size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Most Frequent Condition</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', margin: '0.25rem 0' }}>
                                        {topCondition}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                                        Based on your symptom analysis history
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ marginTop: '0.2rem', color: '#3B82F6' }}><FaUserMd size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Recommended Specialist</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', margin: '0.25rem 0' }}>
                                        {doctorName}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                                        Based on your most recent checkup
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
