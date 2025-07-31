using travel from '../db/interactions';

type TravelRequests :{
      ID          : UUID;
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


service TravelService {

   
  entity TravelRequests as projection on travel.TravelRequests;

  action startTravelWorkflow(travelData: LargeString) returns String;


}
