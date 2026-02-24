import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Gender = {
    #male;
    #female;
    #diverse;
  };

  type Patient = {
    firstName : Text;
    lastName : Text;
    birthdate : Text;
    gender : Gender;
    address : Text;
    phoneNumber : Text;
    registrationNumber : Text;
  };

  module Patient {
    public func compare(patient1 : Patient, patient2 : Patient) : Order.Order {
      switch (Text.compare(patient1.firstName, patient2.firstName)) {
        case (#equal) { Text.compare(patient1.lastName, patient2.lastName) };
        case (order) { order };
      };
    };
  };

  let patients = Map.empty<Text, Patient>();

  var patientCounter = 0;
  var currentYear = 0;

  func getCurrentYear() : Nat {
    let systemTime = Time.now();
    let seconds = systemTime / 1_000_000_000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let years = days / 365;
    1970 + Int.abs(years);
  };

  public shared ({ caller }) func addPatient(
    firstName : Text,
    lastName : Text,
    birthdate : Text,
    gender : Gender,
    address : Text,
    phoneNumber : Text,
  ) : async Text {
    let year = getCurrentYear();

    if (year != currentYear) {
      currentYear := year;
      patientCounter := 0;
    };

    let registrationNumber = year.toText() # "/" # patientCounter.toText();

    let patient : Patient = {
      firstName;
      lastName;
      birthdate;
      gender;
      address;
      phoneNumber;
      registrationNumber;
    };

    patients.add(registrationNumber, patient);
    patientCounter += 1;

    registrationNumber;
  };

  public shared ({ caller }) func updatePatient(
    registrationNumber : Text,
    firstName : Text,
    lastName : Text,
    birthdate : Text,
    gender : Gender,
    address : Text,
    phoneNumber : Text,
  ) : async Patient {
    let existingPatient = switch (patients.get(registrationNumber)) {
      case (null) { Runtime.trap("Patient does not exist!") };
      case (?patient) { patient };
    };

    let updatedPatient : Patient = {
      firstName;
      lastName;
      birthdate;
      gender;
      address;
      phoneNumber;
      registrationNumber;
    };

    patients.add(registrationNumber, updatedPatient);
    updatedPatient;
  };

  public shared ({ caller }) func deletePatient(registrationNumber : Text) : async () {
    switch (patients.get(registrationNumber)) {
      case (null) { Runtime.trap("Patient does not exist!") };
      case (?_) {
        patients.remove(registrationNumber);
      };
    };
  };

  public query ({ caller }) func getPatient(registrationNumber : Text) : async Patient {
    switch (patients.get(registrationNumber)) {
      case (null) { Runtime.trap("No patient with given registration number found!") };
      case (?patient) { patient };
    };
  };

  public query ({ caller }) func getAllPatientsSorted() : async [Patient] {
    patients.values().toArray().sort();
  };
};
