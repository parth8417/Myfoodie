import React, { useState, useEffect } from 'react';
import './Summary.css';
import axios from 'axios';
import { url, currency } from '../../assets/assets';
import { toast } from 'react-toastify';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  MdTrendingUp, 
  MdShoppingCart, 
  MdPeople, 
  MdRestaurant,
  MdRefresh,
  MdCalendarToday,
  MdAttachMoney,
  MdAnalytics,
  MdShowChart,
  MdAssessment
} from 'react-icons/md';

const Summary = () => {
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    monthlyOrders: 0,
    topFoodItems: [],
    revenueChartData: [],
    ordersChartData: [],
    recentOrders: [],
    orderStatusDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch summary data
  const fetchSummaryData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await axios.get(`${url}/api/admin/summary`);
      
      if (response.data.success) {
        setSummaryData(response.data.data);
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  // Colors for charts
  const CHART_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  // Format currency
  const formatCurrency = (amount) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="summary-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="summary">
      {/* Hero Header Section */}
      <div className="summary-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Dashboard Overview</h1>
            <p>Monitor your restaurant's performance with real-time analytics and insights</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">{formatCurrency(summaryData.totalRevenue)}</span>
                <span className="hero-stat-label">Total Revenue</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">{summaryData.totalOrders}</span>
                <span className="hero-stat-label">Total Orders</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">{summaryData.totalCustomers}</span>
                <span className="hero-stat-label">Customers</span>
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <button 
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={() => fetchSummaryData(true)}
              disabled={refreshing}
            >
              <MdRefresh />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <div className="last-updated">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Quick Stats Grid */}
        <div className="quick-stats-section">
          <h2 className="section-title">
            <MdAnalytics className="section-icon" />
            Key Performance Metrics
          </h2>
          <div className="stats-grid">
            <div className="stat-card revenue">
              <div className="stat-header">
                <div className="stat-icon">
                  <MdAttachMoney />
                </div>
                <div className="stat-trend positive">
                  <MdTrendingUp />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-number">{formatCurrency(summaryData.totalRevenue)}</p>
                <span className="stat-label">All time earnings</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar revenue-progress"></div>
              </div>
            </div>

            <div className="stat-card orders">
              <div className="stat-header">
                <div className="stat-icon">
                  <MdShoppingCart />
                </div>
                <div className="stat-trend positive">
                  <MdTrendingUp />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-number">{summaryData.totalOrders.toLocaleString()}</p>
                <span className="stat-label">Orders placed</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar orders-progress"></div>
              </div>
            </div>

            <div className="stat-card customers">
              <div className="stat-header">
                <div className="stat-icon">
                  <MdPeople />
                </div>
                <div className="stat-trend positive">
                  <MdTrendingUp />
                  <span>+15.3%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3>Total Customers</h3>
                <p className="stat-number">{summaryData.totalCustomers.toLocaleString()}</p>
                <span className="stat-label">Registered users</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar customers-progress"></div>
              </div>
            </div>

            <div className="stat-card monthly">
              <div className="stat-header">
                <div className="stat-icon">
                  <MdCalendarToday />
                </div>
                <div className="stat-trend positive">
                  <MdTrendingUp />
                  <span>+22.1%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3>This Month</h3>
                <p className="stat-number">{summaryData.monthlyOrders.toLocaleString()}</p>
                <span className="stat-label">Orders this month</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar monthly-progress"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <h2 className="section-title">
            <MdShowChart className="section-icon" />
            Analytics & Trends
          </h2>
          <div className="charts-grid">
            {/* Revenue Chart */}
            <div className="chart-card revenue-chart">
              <div className="chart-header">
                <div className="chart-title">
                  <h3>Revenue Trend</h3>
                  <span className="chart-subtitle">Last 7 days performance</span>
                </div>
                <div className="chart-info">
                  <MdAttachMoney />
                  <span>Daily Revenue</span>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={summaryData.revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#8c92ac"
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="#8c92ac"
                      fontSize={12}
                      tickFormatter={(value) => `${currency}${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      labelFormatter={(label) => `Day: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#revenueGradient)" 
                      radius={[6, 6, 0, 0]}
                      stroke="#667eea"
                      strokeWidth={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="chart-card orders-chart">
              <div className="chart-header">
                <div className="chart-title">
                  <h3>Orders Trend</h3>
                  <span className="chart-subtitle">Daily order count</span>
                </div>
                <div className="chart-info">
                  <MdShoppingCart />
                  <span>Orders per Day</span>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={summaryData.ordersChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f093fb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f5576c" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#8c92ac"
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="#8c92ac"
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Orders']}
                      labelFormatter={(label) => `Day: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#f5576c" 
                      strokeWidth={4}
                      dot={{ fill: '#f5576c', strokeWidth: 3, r: 6 }}
                      activeDot={{ r: 8, stroke: '#f5576c', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#orderGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Top Food Items and Recent Orders */}
        <div className="secondary-analytics">
          <h2 className="section-title">
            <MdAssessment className="section-icon" />
            Business Insights
          </h2>
          
          <div className="analytics-grid">
            {/* Top Food Items */}
            <div className="analytics-card top-foods">
              <div className="card-header">
                <div className="card-title">
                  <h3>Top Performing Items</h3>
                  <span className="card-subtitle">Most ordered food items</span>
                </div>
                <MdRestaurant className="header-icon" />
              </div>
              <div className="top-foods-list">
                {summaryData.topFoodItems.length > 0 ? (
                  summaryData.topFoodItems.map((item, index) => (
                    <div key={item._id} className="food-item">
                      <div className="food-rank">
                        <span className="rank-number">#{index + 1}</span>
                      </div>
                      <div className="food-details">
                        <h4>{item.name}</h4>
                        <div className="food-stats">
                          <div className="stat-group">
                            <span className="stat-label">Quantity</span>
                            <span className="stat-value">{item.totalOrdered}</span>
                          </div>
                          <div className="stat-group">
                            <span className="stat-label">Revenue</span>
                            <span className="stat-value revenue">{formatCurrency(item.totalRevenue)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="food-progress">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${summaryData.topFoodItems.length > 0 ? (item.totalOrdered / Math.max(...summaryData.topFoodItems.map(f => f.totalOrdered))) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <MdRestaurant />
                    <p>No food items data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="analytics-card status-distribution">
              <div className="card-header">
                <div className="card-title">
                  <h3>Order Status Overview</h3>
                  <span className="card-subtitle">Current order distribution</span>
                </div>
                <div className="total-orders-badge">
                  Total: {summaryData.totalOrders}
                </div>
              </div>
              <div className="chart-container pie-chart">
                {summaryData.orderStatusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={summaryData.orderStatusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="_id"
                      >
                        {summaryData.orderStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [value, name]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span style={{ color: '#4a5568', fontWeight: 500 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data">
                    <MdShoppingCart />
                    <p>No order status data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="analytics-card recent-orders">
              <div className="card-header">
                <div className="card-title">
                  <h3>Recent Activity</h3>
                  <span className="card-subtitle">Latest orders</span>
                </div>
                <span className="orders-count">{summaryData.recentOrders.length} recent</span>
              </div>
              <div className="orders-list">
                {summaryData.recentOrders.length > 0 ? (
                  summaryData.recentOrders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div className="order-avatar">
                        <MdShoppingCart />
                      </div>
                      <div className="order-details">
                        <div className="order-header">
                          <span className="order-id">#{order._id.slice(-6)}</span>
                          <span className="order-amount">{formatCurrency(order.amount)}</span>
                        </div>
                        <div className="order-meta">
                          <span className={`status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {order.status}
                          </span>
                          <span className="order-date">
                            {formatDate(order.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <MdShoppingCart />
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
