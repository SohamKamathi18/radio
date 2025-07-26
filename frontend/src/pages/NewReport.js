import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  User, 
  Calendar, 
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const NewReport = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: '',
    clinicalNotes: '',
    studyType: 'chest-xray'
  });

  const handlePatientDataChange = (field, value) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientIdLookup = async () => {
    if (!patientData.patientId) return;

    // Mock patient lookup
    const mockPatients = {
      'P001': { name: 'John Doe', age: 45, gender: 'male' },
      'P002': { name: 'Jane Smith', age: 38, gender: 'female' },
      'P003': { name: 'Robert Johnson', age: 62, gender: 'male' }
    };

    const patient = mockPatients[patientData.patientId];
    if (patient) {
      setPatientData(prev => ({ ...prev, ...patient }));
      toast({
        title: "Patient found",
        description: `Loaded data for ${patient.name}`,
      });
    } else {
      toast({
        title: "Patient not found",
        description: "Please enter patient details manually",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadedFile(file);
      
      // Mock upload process
      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep(3);
        simulateAIProcessing();
        toast({
          title: "File uploaded successfully",
          description: "Starting AI analysis...",
        });
      }, 1500);
    }
  };

  const simulateAIProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate AI processing with progress updates
    const intervals = [
      { progress: 20, message: "Preprocessing image..." },
      { progress: 40, message: "Detecting anatomical structures..." },
      { progress: 60, message: "Analyzing lung fields..." },
      { progress: 80, message: "Generating segmentation masks..." },
      { progress: 100, message: "Finalizing report..." }
    ];

    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(intervals[i].progress);
    }

    setIsProcessing(false);
    setCurrentStep(4);
    
    toast({
      title: "AI Analysis Complete",
      description: "Report is ready for review",
    });
  };

  const handleSubmit = () => {
    if (!patientData.name || !patientData.age || !uploadedFile) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    // Mock report creation
    const reportId = 'RPT-' + Date.now();
    navigate(`/report/${reportId}`);
  };

  const steps = [
    { id: 1, title: 'Patient Information', icon: User },
    { id: 2, title: 'Image Upload', icon: Upload },
    { id: 3, title: 'AI Processing', icon: Activity },
    { id: 4, title: 'Review', icon: CheckCircle }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Report</h1>
          <p className="text-gray-600 mt-1">Create a new radiology report with AI assistance</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrent 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-200' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Patient Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
              <CardDescription>Enter patient details or lookup existing patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="P001"
                    value={patientData.patientId}
                    onChange={(e) => handlePatientDataChange('patientId', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handlePatientIdLookup}
                    variant="outline"
                    className="mb-0"
                  >
                    Lookup
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Patient Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={patientData.name}
                    onChange={(e) => handlePatientDataChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="45"
                    value={patientData.age}
                    onChange={(e) => handlePatientDataChange('age', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={patientData.gender} 
                    onValueChange={(value) => handlePatientDataChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="studyType">Study Type</Label>
                  <Select 
                    value={patientData.studyType} 
                    onValueChange={(value) => handlePatientDataChange('studyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select study type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chest-xray">Chest X-Ray</SelectItem>
                      <SelectItem value="ct-scan">CT Scan</SelectItem>
                      <SelectItem value="mri">MRI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea
                  id="clinicalNotes"
                  placeholder="Enter relevant clinical history, symptoms, or concerns..."
                  value={patientData.clinicalNotes}
                  onChange={(e) => handlePatientDataChange('clinicalNotes', e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!patientData.name || !patientData.age}
                className="w-full"
              >
                Continue to Image Upload
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Image Upload */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Image Upload
              </CardTitle>
              <CardDescription>Upload medical images for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".dcm,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports .dcm, .jpg, .png files up to 50MB
                      </p>
                    </div>
                    {isUploading && (
                      <div className="w-full max-w-xs mx-auto">
                        <Progress value={75} className="h-2" />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Processing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                AI Processing
              </CardTitle>
              <CardDescription>Advanced AI is analyzing your medical image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Processing Image...</h3>
                  <p className="text-sm text-gray-600">
                    AI is analyzing anatomical structures and potential abnormalities
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">AI Analysis in Progress</p>
                    <p className="text-sm text-blue-700">
                      Our advanced AI model is examining the image for diagnostic insights
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Ready for Review
              </CardTitle>
              <CardDescription>AI analysis complete - ready to review the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Analysis Complete</p>
                    <p className="text-sm text-green-700">
                      AI has generated a preliminary report with 94% confidence
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Start New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default NewReport;