import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Patient {
    birthdate: string;
    registrationNumber: string;
    address: string;
    gender: Gender;
    phoneNumber: string;
    lastName: string;
    firstName: string;
}
export enum Gender {
    female = "female",
    male = "male",
    diverse = "diverse"
}
export interface backendInterface {
    addPatient(firstName: string, lastName: string, birthdate: string, gender: Gender, address: string, phoneNumber: string): Promise<string>;
    deletePatient(registrationNumber: string): Promise<void>;
    getAllPatientsSorted(): Promise<Array<Patient>>;
    getPatient(registrationNumber: string): Promise<Patient>;
    updatePatient(registrationNumber: string, firstName: string, lastName: string, birthdate: string, gender: Gender, address: string, phoneNumber: string): Promise<Patient>;
}
