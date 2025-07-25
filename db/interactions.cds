namespace travel;

entity TravelBooking {
  key ID: UUID;
  employee_ID: String;
  destination: String;
  departureDate: Date;
  returnDate: Date;
  flightCost: Decimal(10,2);
  hotelCost: Decimal(10,2);
  transportCost: Decimal(10,2);
  totalCost: Decimal(10,2);
}

entity Expense {
  key ID: UUID;
  employee_ID: String;
  category: String;
  date: Date;
  amount: Decimal(10,2);
  receipt: LargeBinary;
  report_ID: Association to ExpenseReport;
}

entity ExpenseReport {
  key ID: UUID;
  title: String;
  employee_ID: String;
  submittedAt: Timestamp;
  status: String; // Draft, Submitted, Approved, Rejected
  approver_ID: String;
  expenses: Composition of many Expense on expenses.report_ID = $self;
}

entity TravelRequests {
  key ID          : UUID;
      employee    : String;
      startDate   : Date;
      endDate     : Date;
      postingDate : Date;
      selfTravel  : String;
      placeOfVisit: String;
      estimatedCost: Decimal(10,2);
      action      : Integer;
      createdAt   : Timestamp;
      departure: String;
      arrival:String;
      travelType: String;
      purposeOfTravel: String;
      additionalTravellers: String;
      advances: String;
      costAssignment: String;
      status: String; //review, draft, approval
}
