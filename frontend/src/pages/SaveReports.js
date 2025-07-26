import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Save,
  RefreshCw,
  Calendar,
  User,
  Activity
} from 'lucide-react';

const SaveReports = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const { toast } = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      simulateDataExtraction(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  };

  const simulateDataExtraction = async (file) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setExtractedData(null);

    const steps = [
      { progress: 20, message: "Reading PDF content..." },
      { progress: 40, message: "Extracting text using OCR..." },
      { progress: 60, message: "Processing medical data..." },
      { progress: 80, message: "Structuring extracted information..." },
      { progress: 100, message: "Extraction complete!" }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(steps[i].progress);
    }

    // Mock extracted data
    const mockExtractedData = {
      fileName: file.name,
      reportType: 'Chest X-Ray Report',
      extractedFields: {
        patientName: 'John Michael Doe',
        patientId: 'P001234',
        age: '45',
        gender: 'Male',
        studyDate: '2024-01-15',
        studyType: 'Chest X-Ray PA and Lateral',
        clinicalHistory: 'Chest pain and shortness of breath for 2 weeks',
        findings: `The heart size is within normal limits. The cardiac silhouette demonstrates normal configuration without evidence of cardiomegaly.

The lung fields demonstrate clear aeration bilaterally. There is a subtle opacity in the left lower lobe that may represent early infiltrate or atelectasis. No evidence of pneumothorax or pleural effusion.

The bony structures appear intact without evidence of fracture or lytic lesions.`,
        impression: `1. Subtle left lower lobe opacity - recommend clinical correlation and possible follow-up imaging if clinically indicated.
2. Otherwise normal chest radiograph.`,
        recommendations: 'Clinical correlation recommended. If symptoms persist, consider follow-up chest CT for further evaluation.',
        radiologist: 'Dr. Sarah Johnson, MD',
        reportDate: '2024-01-15',
        confidence: 94
      },
      metadata: {
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadedAt: new Date().toISOString(),
        extractionMethod: 'AI-powered OCR + Medical NLP',
        processingTime: '5.2 seconds'
      }
    };

    setExtractedData(mockExtractedData);
    setIsProcessing(false);
    
    toast({
      title: "Extraction Complete",
      description: "Successfully extracted structured data from PDF report.",
    });
  };

  const handleSaveToDatabase = async () => {
    if (!extractedData) return;

    setIsSaving(true);
    
    // Mock database save
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const savedReport = {
      id: 'RPT-' + Date.now(),
      ...extractedData,
      savedAt: new Date().toISOString(),
      status: 'saved'
    };

    setSavedReports(prev => [savedReport, ...prev]);
    setIsSaving(false);
    
    toast({
      title: "Report Saved",
      description: "Report has been successfully saved to database.",
    });

    // Reset form
    setUploadedFile(null);
    setExtractedData(null);
    setProcessingProgress(0);
  };

  const handleEditField = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      extractedFields: {
        ...prev.extractedFields,
        [field]: value
      }
    }));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Save Reports to Database</h1>
          <p className="text-gray-600 mt-1">Upload PDF reports and extract structured data for database storage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Processing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload PDF Report
                </CardTitle>
                <CardDescription>
                  Upload radiology reports in PDF format for data extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {uploadedFile ? uploadedFile.name : 'Drop PDF here or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF files up to 10MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            {isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Extracting data...</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      AI is extracting structured data from your PDF report...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extracted Data */}
            {extractedData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Extracted Data
                  </CardTitle>
                  <CardDescription>
                    Review and edit extracted information before saving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        value={extractedData.extractedFields.patientName}
                        onChange={(e) => handleEditField('patientName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        value={extractedData.extractedFields.patientId}
                        onChange={(e) => handleEditField('patientId', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={extractedData.extractedFields.age}
                        onChange={(e) => handleEditField('age', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={extractedData.extractedFields.gender}
                        onChange={(e) => handleEditField('gender', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studyDate">Study Date</Label>
                      <Input
                        id="studyDate"
                        value={extractedData.extractedFields.studyDate}
                        onChange={(e) => handleEditField('studyDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studyType">Study Type</Label>
                      <Input
                        id="studyType"
                        value={extractedData.extractedFields.studyType}
                        onChange={(e) => handleEditField('studyType', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Clinical History */}
                  <div>
                    <Label htmlFor="clinicalHistory">Clinical History</Label>
                    <Textarea
                      id="clinicalHistory"
                      value={extractedData.extractedFields.clinicalHistory}
                      onChange={(e) => handleEditField('clinicalHistory', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Findings */}
                  <div>
                    <Label htmlFor="findings">Findings</Label>
                    <Textarea
                      id="findings"
                      value={extractedData.extractedFields.findings}
                      onChange={(e) => handleEditField('findings', e.target.value)}
                      rows={5}
                    />
                  </div>

                  {/* Impression */}
                  <div>
                    <Label htmlFor="impression">Impression</Label>
                    <Textarea
                      id="impression"
                      value={extractedData.extractedFields.impression}
                      onChange={(e) => handleEditField('impression', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Recommendations */}
                  <div>
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      value={extractedData.extractedFields.recommendations}
                      onChange={(e) => handleEditField('recommendations', e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Radiologist */}
                  <div>
                    <Label htmlFor="radiologist">Radiologist</Label>
                    <Input
                      id="radiologist"
                      value={extractedData.extractedFields.radiologist}
                      onChange={(e) => handleEditField('radiologist', e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleSaveToDatabase}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Database
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null);
                        setExtractedData(null);
                      }}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Metadata & Recent Reports */}
          <div className="space-y-6">
            {/* Extraction Metadata */}
            {extractedData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Extraction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Size:</span>
                    <span className="text-sm font-medium">{extractedData.metadata.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Time:</span>
                    <span className="text-sm font-medium">{extractedData.metadata.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <Badge variant="outline">{extractedData.extractedFields.confidence}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Method:</span>
                    <span className="text-sm font-medium">{extractedData.metadata.extractionMethod}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Saved Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Recent Saved Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No reports saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedReports.map((report) => (
                      <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{report.extractedFields.patientName}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Saved
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <User className="h-3 w-3 mr-1" />
                          {report.extractedFields.patientId}
                          <Calendar className="h-3 w-3 ml-3 mr-1" />
                          {report.extractedFields.studyDate}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{report.reportType}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Processed:</span>
                  <span className="text-sm font-medium">{savedReports.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate:</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Processing Time:</span>
                  <span className="text-sm font-medium">5.2s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SaveReports;