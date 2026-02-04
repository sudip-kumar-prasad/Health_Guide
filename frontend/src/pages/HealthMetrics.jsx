import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaWeight, FaHeartbeat, FaTint, FaThermometerHalf, FaCalculator, FaPlus, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const HealthMetrics = () => {
    const [activeTab, setActiveTab] = useState('bmi');
    const [metrics, setMetrics] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // BMI Calculator state
    const [bmiData, setBmiData] = useState({
        height: '',
        weight: '',
        unit: 'metric' // metric or imperial
    });
    const [bmiResult, setBmiResult] = useState(null);

    // Add Metric state
    const [newMetric, setNewMetric] = useState({
        type: 'blood_pressure',
        value: '',
        systolic: '',
        diastolic: '',
        unit: '',
        notes: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const metricTypes = [
        { value: 'bmi', label: 'BMI Calculator', icon: <FaCalculator />, unit: 'kg/m²', color: '#3B82F6', gradient: 'from-blue-400 to-blue-600' },
        { value: 'weight', label: 'Weight', icon: <FaWeight />, unit: 'kg', color: '#10B981', gradient: 'from-emerald-400 to-emerald-600' },
        { value: 'blood_pressure', label: 'Blood Pressure', icon: <FaHeartbeat />, unit: 'mmHg', color: '#EF4444', gradient: 'from-red-400 to-red-600' },
        { value: 'blood_sugar', label: 'Blood Sugar', icon: <FaTint />, unit: 'mg/dL', color: '#F59E0B', gradient: 'from-amber-400 to-amber-600' },
        { value: 'temperature', label: 'Temperature', icon: <FaThermometerHalf />, unit: '°C', color: '#8B5CF6', gradient: 'from-violet-400 to-violet-600' },
        { value: 'heart_rate', label: 'Heart Rate', icon: <FaHeartbeat />, unit: 'bpm', color: '#EC4899', gradient: 'from-pink-400 to-pink-600' }
    ];

    useEffect(() => {
        if (activeTab !== 'bmi') {
            fetchMetrics(activeTab);
            fetchStats(activeTab);
        } else {
            fetchMetrics('bmi');
        }
    }, [activeTab]);

    const fetchMetrics = async (type) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5001/api/metrics?type=${type}&limit=30`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMetrics(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching metrics');
        }
        setLoading(false);
    };

    const fetchStats = async (type) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5001/api/metrics/stats/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBMICalculate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/metrics/bmi', bmiData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBmiResult(data);
            toast.success(`BMI Calculated: ${data.bmi}`);
            fetchMetrics('bmi');
        } catch (error) {
            toast.error('Error calculating BMI');
        }
    };

    const handleAddMetric = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            let metricData = { ...newMetric };

            // Handle blood pressure specially
            if (newMetric.type === 'blood_pressure') {
                metricData.value = {
                    systolic: parseInt(newMetric.systolic),
                    diastolic: parseInt(newMetric.diastolic)
                };
                metricData.unit = 'mmHg';
            } else {
                metricData.value = parseFloat(newMetric.value);
                metricData.unit = metricTypes.find(m => m.value === newMetric.type)?.unit || '';
            }

            delete metricData.systolic;
            delete metricData.diastolic;

            await axios.post('http://localhost:5001/api/metrics', metricData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Reading added successfully!');
            setShowAddForm(false);
            setNewMetric({ type: 'blood_pressure', value: '', systolic: '', diastolic: '', unit: '', notes: '' });
            fetchMetrics(activeTab);
            fetchStats(activeTab);
        } catch (error) {
            toast.error('Error adding metric');
        }
    };

    const handleDeleteMetric = async (id) => {
        if (!window.confirm('Delete this reading?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/metrics/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Reading deleted');
            fetchMetrics(activeTab);
            fetchStats(activeTab);
        } catch (error) {
            toast.error('Error deleting metric');
        }
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { label: 'Underweight', color: '#F59E0B', width: '25%' };
        if (bmi < 25) return { label: 'Normal', color: '#10B981', width: '50%' };
        if (bmi < 30) return { label: 'Overweight', color: '#F59E0B', width: '75%' };
        return { label: 'Obese', color: '#EF4444', width: '100%' };
    };

    const formatValue = (metric) => {
        if (metric.type === 'blood_pressure') {
            return `${metric.value.systolic}/${metric.value.diastolic} ${metric.unit}`;
        }
        return `${metric.value} ${metric.unit}`;
    };

    const prepareChartData = () => {
        if (activeTab === 'blood_pressure') {
            return metrics.slice(0, 15).reverse().map(m => ({
                date: format(new Date(m.recordedAt), 'MMM dd'),
                Systolic: m.value.systolic,
                Diastolic: m.value.diastolic
            }));
        }
        return metrics.slice(0, 15).reverse().map(m => ({
            date: format(new Date(m.recordedAt), 'MMM dd'),
            value: parseFloat(m.value)
        }));
    };

    const currentMetricType = metricTypes.find(m => m.value === activeTab);

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
            <div style={{
                marginBottom: '3rem',
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)',
                padding: '2rem',
                borderRadius: '2rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <h1 className="page-title gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Health Metrics</h1>
                <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>Track your vital health measurements and visualize your progress</p>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none'
            }} className="custom-scrollbar">
                {metricTypes.map(type => (
                    <button
                        key={type.value}
                        onClick={() => setActiveTab(type.value)}
                        className={`card-hover-effect ${activeTab === type.value ? 'active-tab' : ''}`}
                        style={{
                            padding: '1rem 1.5rem',
                            background: activeTab === type.value ? type.color : 'var(--surface)',
                            color: activeTab === type.value ? 'white' : 'var(--text-light)',
                            border: activeTab === type.value ? 'none' : '1px solid var(--border)',
                            borderRadius: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            whiteSpace: 'nowrap',
                            boxShadow: activeTab === type.value ? `0 10px 20px -5px ${type.color}66` : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{type.icon}</span> {type.label}
                    </button>
                ))}
            </div>

            {/* BMI Calculator */}
            {activeTab === 'bmi' && (
                <div className="glass-panel animate-fade-in" style={{ padding: '3rem', borderRadius: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.8rem' }}>
                        <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                            <FaCalculator />
                        </div>
                        Body Mass Index (BMI)
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <form onSubmit={handleBMICalculate}>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ marginLeft: '0.5rem' }}>Unit System</label>
                                    <div style={{ display: 'flex', background: 'var(--background)', padding: '0.5rem', borderRadius: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setBmiData({ ...bmiData, unit: 'metric' })}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                background: bmiData.unit === 'metric' ? 'var(--surface)' : 'transparent',
                                                boxShadow: bmiData.unit === 'metric' ? 'var(--shadow-sm)' : 'none',
                                                fontWeight: '600',
                                                color: bmiData.unit === 'metric' ? 'var(--primary)' : 'var(--text-light)'
                                            }}
                                        >
                                            Metric (cm, kg)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBmiData({ ...bmiData, unit: 'imperial' })}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                background: bmiData.unit === 'imperial' ? 'var(--surface)' : 'transparent',
                                                boxShadow: bmiData.unit === 'imperial' ? 'var(--shadow-sm)' : 'none',
                                                fontWeight: '600',
                                                color: bmiData.unit === 'imperial' ? 'var(--primary)' : 'var(--text-light)'
                                            }}
                                        >
                                            Imperial (in, lbs)
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ marginLeft: '0.5rem' }}>Height ({bmiData.unit === 'metric' ? 'cm' : 'inches'})</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={bmiData.height}
                                        onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                                        required
                                        step="0.1"
                                        style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ marginLeft: '0.5rem' }}>Weight ({bmiData.unit === 'metric' ? 'kg' : 'lbs'})</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={bmiData.weight}
                                        onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                                        required
                                        step="0.1"
                                        style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ borderRadius: '1rem', padding: '1rem', marginTop: '1rem' }}>
                                    Calculate BMI
                                </button>
                            </div>
                        </form>

                        {bmiResult ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <div style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1, color: getBMICategory(bmiResult.bmi).color }}>
                                        {bmiResult.bmi}
                                    </div>
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: '1rem',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '2rem',
                                        background: `${getBMICategory(bmiResult.bmi).color}20`,
                                        color: getBMICategory(bmiResult.bmi).color,
                                        fontWeight: '700',
                                        fontSize: '1.2rem'
                                    }}>
                                        {bmiResult.category}
                                    </div>
                                </div>

                                {/* Visual Indicator Bar */}
                                <div style={{ position: 'relative', height: '1.5rem', background: '#E2E8F0', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: '25%',
                                        background: '#F59E0B',
                                        opacity: 0.5
                                    }} title="Underweight" />
                                    <div style={{
                                        position: 'absolute',
                                        left: '25%',
                                        top: 0,
                                        bottom: 0,
                                        width: '25%',
                                        background: '#10B981',
                                        opacity: 0.5
                                    }} title="Normal" />
                                    <div style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 0,
                                        bottom: 0,
                                        width: '25%',
                                        background: '#F59E0B',
                                        opacity: 0.5
                                    }} title="Overweight" />
                                    <div style={{
                                        position: 'absolute',
                                        left: '75%',
                                        top: 0,
                                        bottom: 0,
                                        width: '25%',
                                        background: '#EF4444',
                                        opacity: 0.5
                                    }} title="Obese" />

                                    {/* Marker */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `calc(${Math.min(Math.max((bmiResult.bmi / 40) * 100, 5), 95)}% - 2px)`,
                                        top: 0,
                                        bottom: 0,
                                        width: '4px',
                                        background: '#1E293B',
                                        zIndex: 10,
                                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                    <span>0</span>
                                    <span>18.5</span>
                                    <span>25</span>
                                    <span>30</span>
                                    <span>40+</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                opacity: 0.5,
                                border: '2px dashed var(--border)',
                                borderRadius: '1.5rem',
                                padding: '2rem'
                            }}>
                                <FaCalculator style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                                <p>Enter your details to calculate BMI</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Other Metrics */}
            {activeTab !== 'bmi' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ margin: 0, color: currentMetricType.color, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {currentMetricType.icon} {currentMetricType.label} Analysis
                        </h2>

                        <button
                            onClick={() => {
                                setShowAddForm(!showAddForm);
                                setNewMetric({ ...newMetric, type: activeTab });
                            }}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '2rem',
                                padding: '0.75rem 1.5rem',
                                background: currentMetricType.color
                            }}
                        >
                            {showAddForm ? <FaTimes /> : <FaPlus />}
                            {showAddForm ? 'Cancel' : 'Add Reading'}
                        </button>
                    </div>

                    {/* Stats Grid */}
                    {stats && stats.count > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div className="card glass-panel card-hover-effect" style={{ padding: '1.5rem', borderLeft: `6px solid ${currentMetricType.color}`, borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Latest Reading</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: currentMetricType.color, lineHeight: 1 }}>
                                    {stats.type === 'blood_pressure'
                                        ? `${stats.latest.value.systolic}/${stats.latest.value.diastolic}`
                                        : stats.latest.value}
                                </div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>{stats.latest.unit}</div>
                            </div>

                            <div className="card glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Average</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stats.average}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Only values</div>
                            </div>

                            <div className="card glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Min</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)', lineHeight: 1 }}>{stats.min}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>All time low</div>
                            </div>

                            <div className="card glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Max</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)', lineHeight: 1 }}>{stats.max}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>All time high</div>
                            </div>
                        </div>
                    )}

                    {/* Add Metric Form */}
                    {showAddForm && (
                        <div className="glass-panel animate-slide-up" style={{ padding: '2.5rem', marginBottom: '3rem', borderRadius: '2rem' }}>
                            <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem' }}>New {currentMetricType.label} Reading</h3>
                            <form onSubmit={handleAddMetric}>
                                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'blood_pressure' ? 'repeat(2, 1fr)' : '1fr', gap: '2rem', marginBottom: '2rem' }}>
                                    {activeTab === 'blood_pressure' ? (
                                        <>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label className="form-label">Systolic (mmHg)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newMetric.systolic}
                                                    onChange={(e) => setNewMetric({ ...newMetric, systolic: e.target.value })}
                                                    required
                                                    style={{ borderRadius: '1rem', padding: '1rem', fontSize: '1.2rem' }}
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label className="form-label">Diastolic (mmHg)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newMetric.diastolic}
                                                    onChange={(e) => setNewMetric({ ...newMetric, diastolic: e.target.value })}
                                                    required
                                                    style={{ borderRadius: '1rem', padding: '1rem', fontSize: '1.2rem' }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Value ({currentMetricType.unit})</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={newMetric.value}
                                                onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                                                required
                                                step="0.1"
                                                style={{ borderRadius: '1rem', padding: '1rem', fontSize: '1.2rem' }}
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Notes (optional)</label>
                                    <textarea
                                        className="form-input"
                                        value={newMetric.notes}
                                        onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                                        rows={2}
                                        style={{ borderRadius: '1rem', padding: '1rem' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '1rem', padding: '1rem', background: currentMetricType.color }}>
                                    Save Reading
                                </button>
                            </form>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                        {/* Chart */}
                        <div className="card glass-panel" style={{ padding: '2rem', borderRadius: '2rem', minHeight: '400px' }}>
                            <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-main)', opacity: 0.8 }}>Trend Analysis</h3>
                            {metrics.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    {activeTab === 'blood_pressure' ? (
                                        <LineChart data={prepareChartData()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dx={-10} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="Systolic" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey="Diastolic" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    ) : (
                                        <AreaChart data={prepareChartData()}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={currentMetricType.color} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={currentMetricType.color} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dx={-10} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke={currentMetricType.color}
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                                name={currentMetricType.label}
                                            />
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                                    No data available for chart
                                </div>
                            )}
                        </div>

                        {/* Recent List */}
                        <div className="card glass-panel custom-scrollbar" style={{ padding: '1.5rem', borderRadius: '2rem', maxHeight: '500px', overflowY: 'auto' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-main)', opacity: 0.8 }}>History</h3>
                            {loading ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Loading...</p>
                            ) : metrics.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No readings recorded yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {metrics.map(metric => (
                                        <div key={metric._id} className="card-hover-effect" style={{
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.5)',
                                            borderRadius: '1rem',
                                            border: '1px solid transparent',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: currentMetricType.color }}>
                                                    {formatValue(metric)}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                                                    {format(new Date(metric.recordedAt), 'MMM dd, h:mm a')}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMetric(metric._id)}
                                                className="btn-icon"
                                                style={{
                                                    color: 'var(--text-light)',
                                                }}
                                                title="Delete reading"
                                            >
                                                <FaTrash style={{ fontSize: '0.9rem' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthMetrics;
