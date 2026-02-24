import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';
import type { Patient } from '../backend';

interface PatientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (updatedData: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    address: string;
    phoneNumber: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function PatientEditModal({
  isOpen,
  onClose,
  patient,
  onSave,
  isLoading = false,
}: PatientEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    address: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (patient) {
      // Parse the birthdate JSON field to extract patient data
      try {
        const data = JSON.parse(patient.birthdate);
        setFormData({
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: data.age || '',
          gender: data.gender || '',
          address: data.address || '',
          phoneNumber: data.phoneNumber || '',
        });
      } catch {
        setFormData({
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: '',
          gender: '',
          address: '',
          phoneNumber: '',
        });
      }
    }
  }, [patient]);

  const handleInputChange = (field: string, value: string) => {
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
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-900 text-xl">
            <Edit className="h-5 w-5" />
            Edit Patient Information
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update patient details. Registration number cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Registration Number (Read-only) */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Registration Number
              </Label>
              <Input
                value={patient.registrationNumber}
                disabled
                className="h-11 bg-gray-100 border-gray-300 text-gray-600"
              />
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName" className="text-gray-700 font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={isLoading}
                  className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-lastName" className="text-gray-700 font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={isLoading}
                  className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-age" className="text-gray-700 font-medium">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  disabled={isLoading}
                  min="1"
                  max="150"
                  className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender" className="text-gray-700 font-medium">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="edit-gender" className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
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

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-gray-700 font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-address"
                type="text"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber" className="text-gray-700 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isLoading}
                className="h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
