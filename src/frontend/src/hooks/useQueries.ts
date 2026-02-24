import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Patient, Gender } from '../backend';

export function useAddPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      birthdate,
      gender,
      address,
      phoneNumber,
    }: {
      firstName: string;
      lastName: string;
      birthdate: string;
      gender: Gender;
      address: string;
      phoneNumber: string;
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      return await actor.addPatient(firstName, lastName, birthdate, gender, address, phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationNumber,
      firstName,
      lastName,
      birthdate,
      gender,
      address,
      phoneNumber,
    }: {
      registrationNumber: string;
      firstName: string;
      lastName: string;
      birthdate: string;
      gender: Gender;
      address: string;
      phoneNumber: string;
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      return await actor.updatePatient(
        registrationNumber,
        firstName,
        lastName,
        birthdate,
        gender,
        address,
        phoneNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useDeletePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationNumber: string) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      return await actor.deletePatient(registrationNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useGetPatient(registrationNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Patient>({
    queryKey: ['patient', registrationNumber],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      return await actor.getPatient(registrationNumber);
    },
    enabled: !!actor && !isFetching && !!registrationNumber,
  });
}

export function useGetAllPatients() {
  const { actor, isFetching } = useActor();

  return useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      if (!actor) {
        return [];
      }
      return await actor.getAllPatientsSorted();
    },
    enabled: !!actor && !isFetching,
  });
}
