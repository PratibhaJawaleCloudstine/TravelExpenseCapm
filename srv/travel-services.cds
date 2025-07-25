using travel from '../db/interactions';

service TravelService {

  entity TravelBooking as projection on travel.TravelBooking;

  entity Expense as projection on travel.Expense;

  entity ExpenseReport as projection on travel.ExpenseReport;
  
  entity TravelRequests as projection on travel.TravelRequests;

  action approveReport(ID: UUID);


}
