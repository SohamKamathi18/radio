import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { 
  FileText, 
  Download, 
  Save, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings,
  History,
  User,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const ReportReview = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [editedReport, setEditedReport] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockData = {
        id: reportId,
        patient: {
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          patientId: 'P001',
          studyDate: '2024-01-15',
          studyType: 'Chest X-Ray'
        },
        aiAnalysis: {
          confidence: 94,
          findings: [
            { type: 'normal', region: 'Heart', description: 'Normal cardiac silhouette', confidence: 96 },
            { type: 'normal', region: 'Lungs', description: 'Clear lung fields bilaterally', confidence: 92 },
            { type: 'abnormal', region: 'Left Lower Lobe', description: 'Subtle opacity suggesting possible infiltrate', confidence: 87 }
          ],
          segmentation: {
            heart: { visible: true, color: '#ef4444' },
            lungs: { visible: true, color: '#3b82f6' },
            ribs: { visible: true, color: '#10b981' },
            abnormalities: { visible: true, color: '#f59e0b' }
          }
        },
        generatedReport: `CLINICAL HISTORY:
45-year-old male with chest pain and shortness of breath.

TECHNIQUE:
Posteroanterior and lateral chest radiographs were obtained.

FINDINGS:
The heart size is within normal limits. The cardiac silhouette demonstrates normal configuration without evidence of cardiomegaly.

The lung fields demonstrate clear aeration bilaterally. There is a subtle opacity in the left lower lobe that may represent early infiltrate or atelectasis. No evidence of pneumothorax or pleural effusion.

The bony structures appear intact without evidence of fracture or lytic lesions.

IMPRESSION:
1. Subtle left lower lobe opacity - recommend clinical correlation and possible follow-up imaging if clinically indicated.
2. Otherwise normal chest radiograph.

RECOMMENDATION:
Clinical correlation recommended. If symptoms persist, consider follow-up chest CT for further evaluation of the left lower lobe opacity.`,
        historicalData: [
          {
            date: '2023-08-15',
            type: 'Chest X-Ray',
            findings: 'Normal study',
            comparison: 'New opacity in left lower lobe'
          },
          {
            date: '2023-02-10',
            type: 'Chest X-Ray',
            findings: 'Normal study',
            comparison: 'No significant change from previous'
          }
        ],
        status: 'draft'
      };
      setReportData(mockData);
      setEditedReport(mockData.generatedReport);
      setIsLoading(false);
    }, 1000);
  }, [reportId]);

  const handleReportChange = (content) => {
    setEditedReport(content);
    setAutoSaveStatus('saving');
    
    // Mock auto-save
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 2000);
  };

  const handleSave = () => {
    toast({
      title: "Report saved",
      description: "Your changes have been saved as draft.",
    });
  };

  const handleFinalize = () => {
    toast({
      title: "Report finalized",
      description: "Report has been marked as complete and sent to patient.",
    });
    navigate('/');
  };

  const handleExport = (format) => {
    toast({
      title: "Export started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  const toggleOverlay = (type) => {
    setReportData(prev => ({
      ...prev,
      aiAnalysis: {
        ...prev.aiAnalysis,
        segmentation: {
          ...prev.aiAnalysis.segmentation,
          [type]: {
            ...prev.aiAnalysis.segmentation[type],
            visible: !prev.aiAnalysis.segmentation[type].visible
          }
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Review</h1>
            <p className="text-gray-600 mt-1">
              {reportData.patient.name} • {reportData.patient.studyType} • {reportData.patient.studyDate}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              AI Confidence: {reportData.aiAnalysis.confidence}%
            </Badge>
            <Badge variant="outline" className={
              autoSaveStatus === 'saved' ? 'text-green-600' : 
              autoSaveStatus === 'saving' ? 'text-yellow-600' : 'text-red-600'
            }>
              {autoSaveStatus === 'saved' ? 'Saved' : 
               autoSaveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Report Editor */}
          <div className="col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Report Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={editedReport}
                  onChange={(e) => handleReportChange(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your report here..."
                />
                <div className="flex justify-between items-center mt-4">
                  <Button onClick={handleSave} variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handleFinalize} size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalize Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium">{reportData.patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age:</span>
                  <span className="text-sm font-medium">{reportData.patient.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender:</span>
                  <span className="text-sm font-medium">{reportData.patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Study Type:</span>
                  <span className="text-sm font-medium">{reportData.patient.studyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Study Date:</span>
                  <span className="text-sm font-medium">{reportData.patient.studyDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Image Viewer */}
          <div className="col-span-5">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Image Viewer
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">{zoomLevel}%</span>
                    <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setZoomLevel(100)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg p-4 h-96 flex items-center justify-center">
                  <div 
                    className="relative bg-gray-800 rounded-lg overflow-hidden"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop" 
                      alt="X-Ray"
                      className="w-80 h-60 object-cover"
                    />
                    
                    {/* AI Overlays */}
                    {overlayVisible && (
                      <div className="absolute inset-0">
                        {/* Heart outline */}
                        {reportData.aiAnalysis.segmentation.heart.visible && (
                          <div className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-red-500 rounded-full opacity-70"></div>
                        )}
                        {/* Lung outlines */}
                        {reportData.aiAnalysis.segmentation.lungs.visible && (
                          <>
                            <div className="absolute top-1/4 left-1/4 w-20 h-32 border-2 border-blue-500 rounded-full opacity-70"></div>
                            <div className="absolute top-1/4 right-1/4 w-20 h-32 border-2 border-blue-500 rounded-full opacity-70"></div>
                          </>
                        )}
                        {/* Abnormality highlight */}
                        {reportData.aiAnalysis.segmentation.abnormalities.visible && (
                          <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-yellow-500 rounded-full opacity-50 animate-pulse"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay Controls */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOverlay('heart')}
                    className={reportData.aiAnalysis.segmentation.heart.visible ? 'bg-red-100' : ''}
                  >
                    Heart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOverlay('lungs')}
                    className={reportData.aiAnalysis.segmentation.lungs.visible ? 'bg-blue-100' : ''}
                  >
                    Lungs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOverlay('abnormalities')}
                    className={reportData.aiAnalysis.segmentation.abnormalities.visible ? 'bg-yellow-100' : ''}
                  >
                    Abnormalities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOverlayVisible(!overlayVisible)}
                  >
                    {overlayVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - AI Analysis & History */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.aiAnalysis.findings.map((finding, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{finding.region}</span>
                        <div className="flex items-center">
                          {finding.type === 'normal' ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {finding.confidence}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{finding.description}</p>
                      <Progress value={finding.confidence} className="h-1 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Historical Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.historicalData.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{item.findings}</p>
                      <p className="text-xs text-blue-600 mt-1">{item.comparison}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExport('pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExport('json')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportReview;