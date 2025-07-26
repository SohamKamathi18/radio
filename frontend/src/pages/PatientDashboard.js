import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  FileText, 
  Download, 
  MessageCircle, 
  Send, 
  User, 
  Calendar, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Brain,
  Heart,
  Shield
} from 'lucide-react';

const PatientDashboard = () => {
  const { token } = useParams();
  const { toast } = useToast();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Mock data loading with token validation
    setTimeout(() => {
      if (token === 'valid-token-123') {
        const mockData = {
          patient: {
            name: 'John Doe',
            reportDate: '2024-01-15',
            studyType: 'Chest X-Ray',
            doctorName: 'Dr. Sarah Johnson'
          },
          summary: {
            status: 'normal',
            keyFindings: [
              'Your chest X-ray shows normal heart size and lung fields',
              'No signs of pneumonia or other lung infections',
              'Bone structures appear healthy and intact'
            ],
            recommendations: [
              'Continue current medications as prescribed',
              'Follow up with your primary care doctor in 3 months',
              'Seek immediate care if you experience worsening symptoms'
            ]
          },
          fullReport: `Dear John,

Your chest X-ray from January 15, 2024 has been reviewed by Dr. Sarah Johnson. Here are the results in simple terms:

WHAT WE FOUND:
• Your heart appears normal in size and position
• Your lungs look clear with no signs of infection
• Your rib cage and chest bones are healthy
• No abnormal masses or growths were detected

WHAT THIS MEANS:
Your chest X-ray shows no concerning findings. This is good news! Your heart and lungs appear to be functioning normally based on this imaging study.

NEXT STEPS:
• Continue taking your medications as prescribed
• Schedule a follow-up appointment with Dr. Smith in 3 months
• Contact your doctor if you experience any new or worsening symptoms

If you have any questions about these results, please don't hesitate to reach out to your healthcare team.

Best regards,
Dr. Sarah Johnson, MD
Radiology Department`,
          aiAnalysis: {
            confidence: 94,
            findings: [
              { region: 'Heart', status: 'normal', description: 'Normal heart size and position' },
              { region: 'Lungs', status: 'normal', description: 'Clear lung fields on both sides' },
              { region: 'Bones', status: 'normal', description: 'Healthy rib cage and chest bones' }
            ]
          }
        };
        setReportData(mockData);
      } else {
        toast({
          title: "Invalid access link",
          description: "This report link is not valid or has expired.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [token, toast]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getMockAIResponse(currentMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getMockAIResponse = (question) => {
    const responses = {
      'normal': "Your chest X-ray shows normal findings, which means everything looks healthy. There are no signs of infection, fluid, or abnormal growths in your lungs or chest area.",
      'heart': "Your heart appears normal in size and position on the X-ray. This is a good sign that your heart is healthy based on this imaging study.",
      'lungs': "Your lungs look clear and healthy on the X-ray. There are no signs of pneumonia, fluid buildup, or other lung problems visible in the image.",
      'next': "Based on your normal results, you should continue your current medications and follow up with your primary care doctor in 3 months as recommended. If you experience any new symptoms, contact your healthcare provider.",
      'symptoms': "If you experience chest pain, shortness of breath, persistent cough, or any other concerning symptoms, you should contact your healthcare provider immediately. Don't wait for your next scheduled appointment if you're worried about new symptoms.",
      'default': "I'm here to help explain your radiology report in simple terms. I can answer questions about your X-ray findings, what they mean, and general recommendations. However, I cannot provide medical advice or replace consultation with your doctor. What specific part of your report would you like me to explain?"
    };

    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('normal')) return responses.normal;
    if (lowerQuestion.includes('heart')) return responses.heart;
    if (lowerQuestion.includes('lung')) return responses.lungs;
    if (lowerQuestion.includes('next') || lowerQuestion.includes('follow')) return responses.next;
    if (lowerQuestion.includes('symptom')) return responses.symptoms;
    
    return responses.default;
  };

  const handleDownload = (type) => {
    toast({
      title: "Download started",
      description: `Downloading your ${type} report...`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">This report link is not valid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">X-AI RadPortal</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Patient Portal
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Medical Report</h1>
          <p className="text-gray-600">
            {reportData.patient.studyType} • {reportData.patient.reportDate} • {reportData.patient.doctorName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Summary of Your Results
                </CardTitle>
                <CardDescription>
                  Here's what we found in simple terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Good News!</h3>
                    <ul className="space-y-2">
                      {reportData.summary.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">What You Should Do Next</h3>
                    <ul className="space-y-2">
                      {reportData.summary.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <Activity className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-800">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Complete Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {reportData.fullReport}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Image Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Your X-Ray Image
                </CardTitle>
                <CardDescription>
                  AI-highlighted areas for your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg p-4 h-64 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop" 
                    alt="Your X-Ray"
                    className="w-80 h-48 object-cover rounded-lg"
                  />
                  
                  {/* Simple overlays for patient view */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute top-1/3 left-1/3 w-12 h-12 border-2 border-green-400 rounded-full opacity-70"></div>
                    <div className="absolute top-1/4 left-1/4 w-16 h-24 border-2 border-green-400 rounded-full opacity-70"></div>
                    <div className="absolute top-1/4 right-1/4 w-16 h-24 border-2 border-green-400 rounded-full opacity-70"></div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Heart: Normal
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Lungs: Clear
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Bones: Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Report Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patient:</span>
                  <span className="text-sm font-medium">{reportData.patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Study Type:</span>
                  <span className="text-sm font-medium">{reportData.patient.studyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{reportData.patient.reportDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Doctor:</span>
                  <span className="text-sm font-medium">{reportData.patient.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Confidence:</span>
                  <Badge variant="outline">{reportData.aiAnalysis.confidence}%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Downloads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Download Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleDownload('PDF')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button 
                  onClick={() => handleDownload('image')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download X-Ray Image
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This AI analysis is for informational purposes only. 
                      Always consult with your healthcare provider for medical advice and treatment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-sm text-blue-100">Ask me about your report</p>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Hi! I'm here to help explain your radiology report.</p>
                <p className="mt-1">You can ask me about your X-ray findings, what they mean, or next steps.</p>
              </div>
            )}
            
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs px-3 py-2 rounded-lg text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your report..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This AI assistant provides information only. Consult your doctor for medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;