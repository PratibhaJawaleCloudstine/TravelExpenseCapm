using travel from '../db/interactions';

service TravelService {

   
  entity TravelRequests as projection on travel.TravelRequests;

  action startTravelWorkflow(travelData: LargeString) returns String;


  // Action exposed as REST endpoint: /TravelService/updateTravelStatus
  action updateTravelStatus(ID: UUID, Approvedstatus: String) returns String;
}
