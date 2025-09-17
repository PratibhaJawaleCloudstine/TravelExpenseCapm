sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("travel.travelexpenseui.controller.CreateTravelRequest", {

    onInit: function () {
      // Initialization logic if needed
      const oCityModel = new sap.ui.model.json.JSONModel();
      oCityModel.loadData("model/cities.json");
      this.getView().setModel(oCityModel, "cities");


      const oData = {
        name: "Pratibha Jawale",
        id: "EMP001"
      };

      // Create JSON Model
      const oModel = new sap.ui.model.json.JSONModel(oData);

      // Set model with name 'employeeModel'
      this.getOwnerComponent().setModel(oModel, "employeeModel");

      this.getView().setModel(this.getOwnerComponent().getModel());

      this.getOwnerComponent()
      .getRouter()
      .getRoute("RouteCreateTravelRequest")  // replace with your actual route name
      .attachPatternMatched(this._onRouteMatched, this);

    },

    _onRouteMatched: function (oEvent) {
      // Called every time user navigates to this view (including 'back')
      console.log("Returned to CreateTravelRequest screen");
      const oJSONModel = new sap.ui.model.json.JSONModel();
      this.getOwnerComponent().setModel(oJSONModel, "travelData");
      // You can refresh models, reset forms, etc.
    },

    onReview: function () {
      const oView = this.getView();

      const data = {
        startDate: oView.byId("startDate").getDateValue(),
        endDate: oView.byId("endDate").getDateValue(),
        departure: oView.byId("departure").getSelectedItem().getText(),
        arrival: oView.byId("arrival").getSelectedItem().getText(),
        postingDate: oView.byId("postingDate").getDateValue(),
        selfTravel: oView.byId("selfTravel").getSelectedKey(),
        placeOfVisit: oView.byId("placeOfVisit").getValue(),
        travelType: oView.byId("travelType").getSelectedItem().getText(),
        purposeOfTravel: oView.byId("purposeOfTravel").getValue(),
        estimatedCosts: oView.byId("estimatedCosts").getValue(),
        additionalTravellers: oView.byId("additionalTravellers").getValue(),
        advances: oView.byId("advances").getValue(),
        costAssignment: parseInt(oView.byId("costAssignment").getText(), 10) || 0
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
      var oStartDate = this.byId("startDate").getDateValue();
      var oEndDate = this.byId("endDate").getDateValue();

      if (oStartDate && oEndDate && oStartDate >= oEndDate) {
        this.byId("startDate").setValueState("Error");
        this.byId("endDate").setValueState("Error");
        this.byId("startDate").setValueStateText("Start must be before End.");
        this.byId("endDate").setValueStateText("End must be after Start.");
      } else {
        this.byId("startDate").setValueState("None");
        this.byId("endDate").setValueState("None");
      }
    },

    onReviewTravelRequest: function () {

      var oModel = this.getView().getModel(); // OData V4 model
      // Show loader

      const oView = this.getView();
      const startdate = oView.byId("startDate").getDateValue();
      if (!startdate || isNaN(startdate.getTime())) {
        this.byId("startDate").setValueState("Error");
        this.byId("startDate").setValueStateText("start date is invalid or empty.");
        return;
      }
      const formattedStartdate = startdate.toISOString().split('T')[0];

      const enddate = oView.byId("endDate").getDateValue();
      if (!enddate || isNaN(enddate.getTime())) {
        this.byId("endDate").setValueState("Error");
        this.byId("endDate").setValueStateText("end Date is invalid or empty.");
        return;
      }
      const formattedEnddate = enddate.toISOString().split('T')[0];
      var departure = oView.byId("departure").getSelectedItem();
      var arrival = oView.byId("arrival").getSelectedItem();

      if (departure !== null) {
        var departure = oView.byId("departure").getSelectedItem().getText();
      } else {
        this.byId("departure").setValueState("Error");
        this.byId("departure").setValueStateText("departure is empty or not selected.");
        return;
      }

      if (arrival !== null) {
        var arrival = oView.byId("arrival").getSelectedItem().getText();
      } else {
        this.byId("arrival").setValueState("Error");
        this.byId("arrival").setValueStateText("arrival is empty or not selected.");
        return;
      }

      const postingDate = oView.byId("postingDate").getDateValue();
      if (!postingDate || isNaN(postingDate.getTime())) {
        this.byId("postingDate").setValueState("Error");
        this.byId("postingDate").setValueStateText("posting Date is invalid or empty.");
        return;
      }
      const formattedPostingDate = postingDate.toISOString().split('T')[0];
      const selfTravel = oView.byId("selfTravel").getSelectedKey();
      const placeOfVisit = oView.byId("placeOfVisitComboBox").getValue();
      var estimatedCosts = parseInt(oView.byId("estimatedCosts").getValue(), 10) || 0;

      console.log("estimatedCosts-- 152");
      console.log(estimatedCosts);


      if (!placeOfVisit || placeOfVisit.trim() === "") {
        this.byId("placeOfVisitComboBox").setValueState("Error");
        this.byId("placeOfVisitComboBox").setValueStateText("place Of Visit is empty.");
        return;
      }

      var travelType = oView.byId("travelType").getSelectedItem();
      if (travelType !== null) {
        travelType = oView.byId("travelType").getSelectedItem().getText();
      } else {
        this.byId("travelType").setValueState("Error");
        this.byId("travelType").setValueStateText("travel Type is empty or not selected.");
        return;
      }
      var purposeOfTravel = oView.byId("purposeOfTravel").getValue();
      const additionalTravellers = oView.byId("additionalTravellers").getValue();
      const advances = oView.byId("advances").getValue();
      const costAssignment = oView.byId("costAssignment").getText();

      if (!selfTravel) {
        this.byId("selfTravel").setValueState("Error");
        this.byId("selfTravel").setValueStateText("self Travel is empty or not selected.");
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
      const startdate = oView.byId("startDate").getDateValue();
      if (!startdate || isNaN(startdate.getTime())) {
        this.byId("startDate").setValueState("Error");
        this.byId("startDate").setValueStateText("start date is invalid or empty.");
        return;
      }
      const formattedStartdate = startdate.toISOString().split('T')[0];

      const enddate = oView.byId("endDate").getDateValue();
      if (!enddate || isNaN(enddate.getTime())) {
        this.byId("endDate").setValueState("Error");
        this.byId("endDate").setValueStateText("end Date is invalid or empty.");
        return;
      }
      const formattedEnddate = enddate.toISOString().split('T')[0];
      var departure = oView.byId("departure").getSelectedItem();
      var arrival = oView.byId("arrival").getSelectedItem();

      if (departure !== null) {
        var departure = oView.byId("departure").getSelectedItem().getText();
      } else {
        this.byId("departure").setValueState("Error");
        this.byId("departure").setValueStateText("departure is empty or not selected.");
        return;
      }

      if (arrival !== null) {
        var arrival = oView.byId("arrival").getSelectedItem().getText();
      } else {
        this.byId("arrival").setValueState("Error");
        this.byId("arrival").setValueStateText("arrival is empty or not selected.");
        return;
      }

      const postingDate = oView.byId("postingDate").getDateValue();
      if (!postingDate || isNaN(postingDate.getTime())) {
        this.byId("postingDate").setValueState("Error");
        this.byId("postingDate").setValueStateText("posting Date is invalid or empty.");
        return;
      }
      const formattedPostingDate = postingDate.toISOString().split('T')[0];
      const selfTravel = oView.byId("selfTravel").getSelectedKey();
      const placeOfVisit = oView.byId("placeOfVisitComboBox").getValue();
      //var estimatedCosts = oView.byId("estimatedCosts").getValue();
      var estimatedCosts = parseInt(oView.byId("estimatedCosts").getValue(), 10) || 0;
      console.log("estimatedCosts-- 264");
      console.log(estimatedCosts);

      if (!placeOfVisit || placeOfVisit.trim() === "") {
        this.byId("placeOfVisitComboBox").setValueState("Error");
        this.byId("placeOfVisitComboBox").setValueStateText("place Of Visit is empty.");
        return;
      }

      var travelType = oView.byId("travelType").getSelectedItem();
      if (travelType !== null) {
        travelType = oView.byId("travelType").getSelectedItem().getText();
      } else {
        this.byId("travelType").setValueState("Error");
        this.byId("travelType").setValueStateText("travel Type is empty or not selected.");
        return;
      }
      var purposeOfTravel = oView.byId("purposeOfTravel").getValue();
      const additionalTravellers = oView.byId("additionalTravellers").getValue();
      const advances = oView.byId("advances").getValue();
      const costAssignment = oView.byId("costAssignment").getText();

      if (!selfTravel) {
        this.byId("selfTravel").setValueState("Error");
        this.byId("selfTravel").setValueStateText("self Travel is empty or not selected.");
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
        sap.m.MessageToast.show("Travel request "+ travelId +" saved successfully.");
        this.getOwnerComponent().getRouter().navTo("ReviewTravelScreen", {
          travelId: travelId
        });

      }).catch((oError) => {
        sap.m.MessageBox.error("Error saving travel request: " + oError.message);
      }).finally(() => {
        // Hide loader
        this.getView().setBusy(false);
      });
      
    }


  });
});
