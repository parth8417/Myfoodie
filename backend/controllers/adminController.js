import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

// Get admin summary/dashboard data
const getAdminSummary = async (req, res) => {
    try {
        // Get current date and calculate date ranges
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        // Total number of orders
        const totalOrders = await orderModel.countDocuments();
        
        // Total revenue (sum of all paid orders)
        const revenueResult = await orderModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        
        // Total number of customers
        const totalCustomers = await userModel.countDocuments();
        
        // Orders placed in current month
        const monthlyOrders = await orderModel.countDocuments({
            date: { $gte: startOfMonth }
        });
        
        // Top 5 most ordered food items
        const topFoodItems = await orderModel.aggregate([
            { $unwind: "$items" },
            { $group: { 
                _id: "$items._id", 
                name: { $first: "$items.name" },
                totalOrdered: { $sum: "$items.quantity" },
                totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }},
            { $sort: { totalOrdered: -1 } },
            { $limit: 5 }
        ]);
        
        // Revenue for last 7 days (day by day)
        const revenueChart = await orderModel.aggregate([
            { 
                $match: { 
                    date: { $gte: last7Days },
                    payment: true 
                } 
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date" 
                        } 
                    },
                    revenue: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Orders count for last 7 days (day by day)
        const ordersChart = await orderModel.aggregate([
            { 
                $match: { 
                    date: { $gte: last7Days } 
                } 
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date" 
                        } 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Fill in missing dates for charts (ensure 7 days of data)
        const fillMissingDates = (data, field) => {
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
                const dateString = date.toISOString().split('T')[0];
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                const existingData = data.find(item => item._id === dateString);
                result.push({
                    date: dateString,
                    day: dayName,
                    [field]: existingData ? existingData[field] : 0,
                    ...(field === 'revenue' && { orders: existingData ? existingData.orders : 0 })
                });
            }
            return result;
        };
        
        const revenueChartData = fillMissingDates(revenueChart, 'revenue');
        const ordersChartData = fillMissingDates(ordersChart, 'count');
        
        // Recent orders (last 5)
        const recentOrders = await orderModel.find()
            .sort({ date: -1 })
            .limit(5)
            .select('_id amount status date items address');
        
        // Order status distribution
        const orderStatusDistribution = await orderModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                totalCustomers,
                monthlyOrders,
                topFoodItems,
                revenueChartData,
                ordersChartData,
                recentOrders,
                orderStatusDistribution
            }
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching admin summary" });
    }
};

export { getAdminSummary };
