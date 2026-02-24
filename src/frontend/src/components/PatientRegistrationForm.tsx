import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Printer, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAddPatient } from '../hooks/useQueries';
import { generatePatientPDF } from '../utils/pdfGenerator';
import { Gender } from '../backend';

interface PatientFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  address: string;
  phoneNumber: string;
}

export default function PatientRegistrationForm() {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    address: '',
    phoneNumber: '',
  });

  const addPatientMutation = useAddPatient();

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      toast.error('Please enter first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Please enter last name');
      return false;
    }
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error('Please enter a valid age');
      return false;
    }
    if (!formData.gender) {
      toast.error('Please select gender');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Convert gender string to Gender enum
      let genderEnum: Gender;
      switch (formData.gender.toLowerCase()) {
        case 'male':
          genderEnum = Gender.male;
          break;
        case 'female':
          genderEnum = Gender.female;
          break;
        default:
          genderEnum = Gender.diverse;
      }

      // Store all data as JSON in the birthdate field (for compatibility with PDF generation)
      const patientData = JSON.stringify({
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      });

      const registrationNumber = await addPatientMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthdate: patientData,
        gender: genderEnum,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      });

      toast.success('Patient registered successfully!', {
        description: `Registration Number: ${registrationNumber}`,
      });

      // Generate and print PDF
      generatePatientPDF({
        registrationNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        address: '',
        phoneNumber: '',
      });
    } catch (error) {
      toast.error('Failed to register patient', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const isLoading = addPatientMutation.isPending;

  return (
    <Card className="shadow-xl border-cyan-100">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
        <CardTitle className="text-2xl text-cyan-900 flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          Patient Registration
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter patient details to generate a case paper
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={isLoading}
                className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-700 font-medium">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                disabled={isLoading}
                min="1"
                max="150"
                className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700 font-medium">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="gender" className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 font-medium">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isLoading}
              className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              disabled={isLoading}
              className="h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Registering Patient...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-5 w-5" />
                Register & Print Case Paper
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
