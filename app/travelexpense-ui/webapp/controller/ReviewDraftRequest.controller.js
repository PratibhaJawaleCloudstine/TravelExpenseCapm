sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("travel.travelexpenseui.controller.ReviewDraftRequest", {

    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("ReviewDraftRequest").attachPatternMatched(this._onRouteMatched, this);

    },


    _onRouteMatched: function (oEvent) {
      this.travelId = oEvent.getParameter("arguments").travelId;
      console.log("Loaded Travel ID in _onRouteMatched :", this.travelId);

      this.getView().setBusy(true);
      const oModel = this.getOwnerComponent().getModel(); // OData V4 model
      const oContextBinding = oModel.bindContext(`/TravelRequests(${this.travelId})`);

      oContextBinding.requestObject().then((oData) => {
        const oJSONModel = new sap.ui.model.json.JSONModel(oData);
        this.getOwnerComponent().setModel(oJSONModel, "travelData");
        console.log("draft travel data");
        console.log(oJSONModel);

        

        this.getView().setBusy(false);

      }).catch((oError) => {
        console.error("Failed to fetch specific travel request:", oError);
        sap.m.MessageBox.error("Error fetching data.");
      });




    },

    onReview: function () {
      const oView = this.getView();

      const data = {
        startDate: oView.byId("rev_startDate").getDateValue(),
        endDate: oView.byId("rev_endDate").getDateValue(),
        departure: oView.byId("rev_departure").getSelectedItem().getText(),
        arrival: oView.byId("rev_arrival").getSelectedItem().getText(),
        postingDate: oView.byId("rev_postingDate").getDateValue(),
        selfTravel: oView.byId("rev_selfTravel").getSelectedKey(),
        placeOfVisit: oView.byId("rev_placeOfVisit").getValue(),
        travelType: oView.byId("rev_travelType").getSelectedItem().getText(),
        purposeOfTravel: oView.byId("rev_purposeOfTravel").getValue(),
        estimatedCosts: oView.byId("rev_estimatedCosts").getValue(),
        additionalTravellers: oView.byId("rev_additionalTravellers").getValue(),
        advances: oView.byId("rev_advances").getValue(),
        costAssignment: parseInt(oView.byId("rev_costAssignment").getText(), 10) || 0
      };

      console.log("estimatedCosts-- 63");
      console.log(estimatedCosts);


      console.log("Review Data:", data);
      MessageToast.show("Review data captured. Check console.");
    },



    onChangePlace: function (oEvent) {
      const sValue = oEvent.getParameter("value");
      const oComboBox = oEvent.getSource();
      const aItems = oComboBox.getItems();
      const bMatch = aItems.some(item => item.getText() === sValue);

      if (!bMatch) {
        console.log("User entered custom city:", sValue);
      } else {
        console.log("City selected from list:", sValue);
      }
    },

    onDateChange: function () {
      var oStartDate = this.byId("rev_startDate").getDateValue();
      var oEndDate = this.byId("rev_endDate").getDateValue();

      if (oStartDate && oEndDate && oStartDate >= oEndDate) {
        this.byId("rev_startDate").setValueState("Error");
        this.byId("rev_endDate").setValueState("Error");
        this.byId("rev_startDate").setValueStateText("Start must be before End.");
        this.byId("rev_endDate").setValueStateText("End must be after Start.");
      } else {
        this.byId("rev_startDate").setValueState("None");
        this.byId("rev_endDate").setValueState("None");
      }
    },

    

    onReviewTravelRequest: function () {

      var oModel = this.getView().getModel(); // OData V4 model
      // Show loader

      const oView = this.getView();
      const startdate = oView.byId("rev_startDate").getDateValue();
      if (!startdate || isNaN(startdate.getTime())) {
        this.byId("rev_startDate").setValueState("Error");
        this.byId("rev_startDate").setValueStateText("start date is invalid or empty.");
        return;
      }

      const enddate = oView.byId("rev_endDate").getDateValue();
      if (!enddate || isNaN(enddate.getTime())) {
        this.byId("rev_endDate").setValueState("Error");
        this.byId("rev_endDate").setValueStateText("end Date is invalid or empty.");
        return;
      }

    


      var departure = oView.byId("rev_departure").getSelectedItem();
      var arrival = oView.byId("rev_arrival").getSelectedItem();

      if (departure !== null) {
        var departure = oView.byId("rev_departure").getSelectedItem().getText();
      } else {
        this.byId("rev_departure").setValueState("Error");
        this.byId("rev_departure").setValueStateText("departure is empty or not selected.");
        return;
      }

      if (arrival !== null) {
        var arrival = oView.byId("rev_arrival").getSelectedItem().getText();
      } else {
        this.byId("rev_arrival").setValueState("Error");
        this.byId("rev_arrival").setValueStateText("arrival is empty or not selected.");
        return;
      }

      const postingDate = oView.byId("rev_postingDate").getDateValue();
      if (!postingDate || isNaN(postingDate.getTime())) {
        this.byId("rev_postingDate").setValueState("Error");
        this.byId("rev_postingDate").setValueStateText("posting Date is invalid or empty.");
        return;
      }



      const formStartDate = formatDateLocal(startdate);
const formEndDate   = formatDateLocal(enddate);
const formPostingDate = formatDateLocal(postingDate);
console.log(formStartDate);
console.log(formEndDate);
console.log(formPostingDate);




      const selfTravel = oView.byId("rev_selfTravel").getSelectedKey();
      const placeOfVisit = oView.byId("rev_placeOfVisitComboBox").getValue();
      var estimatedCosts = parseInt(oView.byId("rev_estimatedCosts").getValue(), 10) || 0;

      console.log("estimatedCosts-- 152");
      console.log(estimatedCosts);


      if (!placeOfVisit || placeOfVisit.trim() === "") {
        this.byId("rev_placeOfVisitComboBox").setValueState("Error");
        this.byId("rev_placeOfVisitComboBox").setValueStateText("place Of Visit is empty.");
        return;
      }

      var travelType = oView.byId("rev_travelType").getSelectedItem();
      if (travelType !== null) {
        travelType = oView.byId("rev_travelType").getSelectedItem().getText();
      } else {
        this.byId("rev_travelType").setValueState("Error");
        this.byId("rev_travelType").setValueStateText("travel Type is empty or not selected.");
        return;
      }
      var purposeOfTravel = oView.byId("rev_purposeOfTravel").getValue();
      const additionalTravellers = oView.byId("rev_additionalTravellers").getValue();
      const advances = oView.byId("rev_advances").getValue();
      const costAssignment = oView.byId("rev_costAssignment").getText();

      if (!selfTravel) {
        this.byId("rev_selfTravel").setValueState("Error");
        this.byId("rev_selfTravel").setValueStateText("self Travel is empty or not selected.");
        return;
      }

      if (!purposeOfTravel) {
        purposeOfTravel = "";
      }

      if (!estimatedCosts) {
        estimatedCosts = 0.00;
      }

      var travelStatus = "Review";

      const travelRequestData = {
        "@odata.context": "$metadata#TravelRequests/$entity",
        ID: travelId,
        employee: "EMP001",
        startDate: formStartDate,
        endDate: formEndDate,
        postingDate: formPostingDate,
        selfTravel: selfTravel,
        placeOfVisit: placeOfVisit,
        estimatedCost: estimatedCosts,
        action: 1,
        createdAt: new Date().toISOString(),
        departure: departure,
        arrival: arrival,
        travelType: travelType,
        purposeOfTravel: purposeOfTravel,
        additionalTravellers: additionalTravellers,
        advances: advances,
        costAssignment: costAssignment,
        status: travelStatus
      };
      console.log("estimatedCosts-- 212");
      console.log(estimatedCosts);

      const oJSONModel = new sap.ui.model.json.JSONModel(travelRequestData);
      this.getOwnerComponent().setModel(oJSONModel, "travelData");
      console.log("empty travelId");
      var travelId = "-";
      // Navigate to Review View
      this.getOwnerComponent().getRouter().navTo("ReviewTravelScreen", {
        travelId: travelId
      });
    },


    onSaveDraft: function () {
      var oModel = this.getView().getModel(); // OData V4 model

      const oView = this.getView();
      const startdate = oView.byId("rev_startDate").getDateValue();
      if (!startdate || isNaN(startdate.getTime())) {
        this.byId("rev_startDate").setValueState("Error");
        this.byId("rev_startDate").setValueStateText("start date is invalid or empty.");
        return;
      }
      const formattedStartdate = startdate.toISOString().split('T')[0];

      const enddate = oView.byId("rev_endDate").getDateValue();
      if (!enddate || isNaN(enddate.getTime())) {
        this.byId("rev_endDate").setValueState("Error");
        this.byId("rev_endDate").setValueStateText("end Date is invalid or empty.");
        return;
      }
      const formattedEnddate = enddate.toISOString().split('T')[0];
      var departure = oView.byId("rev_departure").getSelectedItem();
      var arrival = oView.byId("rev_arrival").getSelectedItem();

      if (departure !== null) {
        var departure = oView.byId("rev_departure").getSelectedItem().getText();
      } else {
        this.byId("rev_departure").setValueState("Error");
        this.byId("rev_departure").setValueStateText("departure is empty or not selected.");
        return;
      }

      if (arrival !== null) {
        var arrival = oView.byId("rev_arrival").getSelectedItem().getText();
      } else {
        this.byId("rev_arrival").setValueState("Error");
        this.byId("rev_arrival").setValueStateText("arrival is empty or not selected.");
        return;
      }

      const postingDate = oView.byId("rev_postingDate").getDateValue();
      if (!postingDate || isNaN(postingDate.getTime())) {
        this.byId("rev_postingDate").setValueState("Error");
        this.byId("rev_postingDate").setValueStateText("posting Date is invalid or empty.");
        return;
      }
      const formattedPostingDate = postingDate.toISOString().split('T')[0];
      const selfTravel = oView.byId("rev_selfTravel").getSelectedKey();
      const placeOfVisit = oView.byId("rev_placeOfVisitComboBox").getValue();
      //var estimatedCosts = oView.byId("rev_estimatedCosts").getValue();
      var estimatedCosts = parseInt(oView.byId("rev_estimatedCosts").getValue(), 10) || 0;
      console.log("estimatedCosts-- 264");
      console.log(estimatedCosts);

      if (!placeOfVisit || placeOfVisit.trim() === "") {
        this.byId("rev_placeOfVisitComboBox").setValueState("Error");
        this.byId("rev_placeOfVisitComboBox").setValueStateText("place Of Visit is empty.");
        return;
      }

      var travelType = oView.byId("rev_travelType").getSelectedItem();
      if (travelType !== null) {
        travelType = oView.byId("rev_travelType").getSelectedItem().getText();
      } else {
        this.byId("rev_travelType").setValueState("Error");
        this.byId("rev_travelType").setValueStateText("travel Type is empty or not selected.");
        return;
      }
      var purposeOfTravel = oView.byId("rev_purposeOfTravel").getValue();
      const additionalTravellers = oView.byId("rev_additionalTravellers").getValue();
      const advances = oView.byId("rev_advances").getValue();
      const costAssignment = oView.byId("rev_costAssignment").getText();

      if (!selfTravel) {
        this.byId("rev_selfTravel").setValueState("Error");
        this.byId("rev_selfTravel").setValueStateText("self Travel is empty or not selected.");
        return;
      }

      if (!purposeOfTravel) {
        purposeOfTravel = "";
      }

      if (!estimatedCosts) {
        estimatedCosts = 0.00;
      }
      var travelId = crypto.randomUUID();
      var travelStatus = "Draft";

      this.getView().setBusy(true);

      // Step 1: Create binding to the entity set (TravelRequests)
      var oListBinding = oModel.bindList("/TravelRequests", undefined, undefined, undefined, {
        $$updateGroupId: "travelGroup"
      });


      // Step 2: Create entry (this returns a context)
      oListBinding.create({
        ID: travelId,
        employee: "EMP001",
        startDate: formattedStartdate,
        endDate: formattedEnddate,
        postingDate: formattedPostingDate,
        selfTravel: selfTravel,
        placeOfVisit: placeOfVisit,
        estimatedCost: estimatedCosts,
        action: 1,
        createdAt: new Date().toISOString(),
        departure: departure,
        arrival: arrival,
        travelType: travelType,
        purposeOfTravel: purposeOfTravel,
        additionalTravellers: additionalTravellers,
        advances: advances,
        costAssignment: costAssignment,
        status: travelStatus
      });



      // Step 3: Submit the batch
      oModel.submitBatch("travelGroup").then(() => {
        sap.m.MessageToast.show("Travel request " + travelId + " saved successfully.");
        this.getOwnerComponent().getRouter().navTo("ReviewTravelScreen", {
          travelId: travelId
        });

        that.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);
      }).catch((oError) => {
        sap.m.MessageBox.error("Error saving travel request: " + oError.message);
      }).finally(() => {
        // Hide loader
        this.getView().setBusy(false);
      });

    }
  });
  function formatDateLocal(oDate) {
    if (!oDate) return null;
    const yyyy = oDate.getFullYear();
    const mm = String(oDate.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const dd = String(oDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
});
