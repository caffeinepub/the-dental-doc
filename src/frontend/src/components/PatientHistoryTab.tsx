import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllPatients, useUpdatePatient, useDeletePatient } from '../hooks/useQueries';
import { Gender } from '../backend';
import type { Patient } from '../backend';
import PasswordPromptModal from './PasswordPromptModal';
import PatientEditModal from './PatientEditModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

export default function PatientHistoryTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: patients, isLoading, error } = useGetAllPatients();
  
  // Password authentication state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    patient: Patient;
  } | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    if (!searchTerm.trim()) return patients;

    const lowerSearch = searchTerm.toLowerCase();
    return patients.filter((patient) => {
      const matchesRegNumber = patient.registrationNumber.toLowerCase().includes(lowerSearch);
      const matchesFirstName = patient.firstName.toLowerCase().includes(lowerSearch);
      const matchesLastName = patient.lastName.toLowerCase().includes(lowerSearch);
      return matchesRegNumber || matchesFirstName || matchesLastName;
    });
  }, [patients, searchTerm]);

  // Parse patient data from birthdate JSON field
  const parsePatientData = (birthdateJson: string) => {
    try {
      const data = JSON.parse(birthdateJson);
      return {
        age: data.age || 'N/A',
        gender: data.gender || 'N/A',
        phoneNumber: data.phoneNumber || 'N/A',
      };
    } catch {
      return {
        age: 'N/A',
        gender: 'N/A',
        phoneNumber: 'N/A',
      };
    }
  };

  // Handle edit button click
  const handleEditClick = (patient: Patient) => {
    setPendingAction({ type: 'edit', patient });
    setShowPasswordModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (patient: Patient) => {
    setPendingAction({ type: 'delete', patient });
    setShowPasswordModal(true);
  };

  // Handle password authentication success
  const handlePasswordSuccess = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'edit') {
      setSelectedPatient(pendingAction.patient);
      setShowEditModal(true);
    } else if (pendingAction.type === 'delete') {
      setPatientToDelete(pendingAction.patient);
      setShowDeleteDialog(true);
    }

    setPendingAction(null);
  };

  // Handle save patient changes
  const handleSavePatient = async (updatedData: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    address: string;
    phoneNumber: string;
  }) => {
    if (!selectedPatient) return;

    try {
      // Convert gender string to Gender enum
      let genderEnum: Gender;
      switch (updatedData.gender.toLowerCase()) {
        case 'male':
          genderEnum = Gender.male;
          break;
        case 'female':
          genderEnum = Gender.female;
          break;
        default:
          genderEnum = Gender.diverse;
      }

      // Store all data as JSON in the birthdate field
      const patientData = JSON.stringify({
        age: updatedData.age,
        gender: updatedData.gender,
        address: updatedData.address,
        phoneNumber: updatedData.phoneNumber,
      });

      await updatePatientMutation.mutateAsync({
        registrationNumber: selectedPatient.registrationNumber,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        birthdate: patientData,
        gender: genderEnum,
        address: updatedData.address,
        phoneNumber: updatedData.phoneNumber,
      });

      toast.success('Patient information updated successfully!');
      setShowEditModal(false);
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Failed to update patient information', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatientMutation.mutateAsync(patientToDelete.registrationNumber);
      toast.success('Patient record deleted successfully!');
      setShowDeleteDialog(false);
      setPatientToDelete(null);
    } catch (error) {
      toast.error('Failed to delete patient record', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  return (
    <>
      <Card className="shadow-xl border-cyan-100">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
          <CardTitle className="text-2xl text-cyan-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Patient History
          </CardTitle>
          <CardDescription className="text-gray-600">
            Search and view all registered patients
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search Input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="search" className="text-gray-700 font-medium">
              Search Patients
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by registration number or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Patient List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Failed to load patient history</p>
              <p className="text-sm text-gray-600 mt-2">
                {error instanceof Error ? error.message : 'Please try again'}
              </p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">
                {searchTerm ? 'No patients found' : 'No patients registered yet'}
              </p>
              <p className="text-sm mt-1">
                {searchTerm
                  ? 'Try a different search term'
                  : 'Register your first patient to see them here'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {filteredPatients.map((patient) => {
                  const { age, gender, phoneNumber } = parsePatientData(patient.birthdate);
                  return (
                    <div
                      key={patient.registrationNumber}
                      className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-cyan-600 font-medium">
                            Reg. No: {patient.registrationNumber}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(patient)}
                            className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(patient)}
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Age:</span>
                          <span className="ml-2 text-gray-900 font-medium">{age} years</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gender:</span>
                          <span className="ml-2 text-gray-900 font-medium">{gender}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <span className="ml-2 text-gray-900 font-medium">{phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Results Count */}
          {!isLoading && !error && filteredPatients.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}
              {searchTerm && patients && filteredPatients.length < patients.length && (
                <span> (filtered from {patients.length} total)</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Prompt Modal */}
      <PasswordPromptModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        title="Authentication Required"
        description={`Please enter the password to ${pendingAction?.type === 'edit' ? 'edit' : 'delete'} this patient record.`}
      />

      {/* Edit Patient Modal */}
      <PatientEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onSave={handleSavePatient}
        isLoading={updatePatientMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        patientName={
          patientToDelete
            ? `${patientToDelete.firstName} ${patientToDelete.lastName}`
            : undefined
        }
      />
    </>
  );
}
