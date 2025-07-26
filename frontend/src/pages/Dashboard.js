import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Activity, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Reports',
      value: '247',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Patients',
      value: '89',
      change: '+5%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'AI Accuracy',
      value: '94.2%',
      change: '+2.1%',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-15%',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentReports = [
    {
      id: 'RPT-2024-001',
      patientName: 'John Doe',
      age: 45,
      studyType: 'Chest X-Ray',
      status: 'completed',
      aiFindings: 'Normal findings',
      timestamp: '2 hours ago',
      confidence: 96
    },
    {
      id: 'RPT-2024-002',
      patientName: 'Jane Smith',
      age: 38,
      studyType: 'Chest X-Ray',
      status: 'review',
      aiFindings: 'Possible pneumonia',
      timestamp: '4 hours ago',
      confidence: 87
    },
    {
      id: 'RPT-2024-003',
      patientName: 'Robert Johnson',
      age: 62,
      studyType: 'Chest X-Ray',
      status: 'draft',
      aiFindings: 'Mild cardiomegaly',
      timestamp: '6 hours ago',
      confidence: 92
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Dr. Johnson</p>
          </div>
          <Button 
            onClick={() => navigate('/new-report')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">{stat.change}</span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Reports</CardTitle>
            <CardDescription>Your latest radiology reports and AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/report/${report.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{report.patientName}</h3>
                        <Badge variant="secondary">{report.age}y</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{report.studyType} • {report.id}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-700">AI: {report.aiFindings}</span>
                        <Badge variant="outline" className="text-xs">
                          {report.confidence}% confident
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">{report.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">AI Training</CardTitle>
              <CardDescription>Review and improve AI model accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Training Data
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Quality Metrics</CardTitle>
              <CardDescription>Monitor diagnostic accuracy and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Patient Reports</CardTitle>
              <CardDescription>Generate and share patient summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;