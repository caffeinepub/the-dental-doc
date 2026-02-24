import Map "mo:core/Map";

module {
  type Gender = {
    #male;
    #female;
    #diverse;
  };

  type OldPatient = {
    firstName : Text;
    lastName : Text;
    birthdate : Text;
    registrationNumber : Text;
  };

  type OldActor = {
    patients : Map.Map<Text, OldPatient>;
    patientCounter : Nat;
    currentYear : Nat;
  };

  type NewPatient = {
    firstName : Text;
    lastName : Text;
    birthdate : Text;
    gender : Gender;
    address : Text;
    phoneNumber : Text;
    registrationNumber : Text;
  };

  type NewActor = {
    patients : Map.Map<Text, NewPatient>;
    patientCounter : Nat;
    currentYear : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPatients = old.patients.map<Text, OldPatient, NewPatient>(
      func(_, oldPatient) {
        {
          oldPatient with
          gender = #male;
          address = "";
          phoneNumber = "";
        };
      }
    );
    {
      old with
      patients = newPatients;
    };
  };
};
