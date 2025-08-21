sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",  
  "sap/ui/model/odata/v4/ODataModel" 
], function (Controller, MessageBox, ODataModel) {
  "use strict";

  return Controller.extend("travel.travelexpenseui.controller.ReviewTravelScreen", {

    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("ReviewTravelScreen").attachPatternMatched(this._onRouteMatched, this);
    },

    onPreviousStep: function () {
      var oHistory = sap.ui.core.routing.History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        // Go back to previous route in browser history
        window.history.go(-1);
      } else {
        // No history - navigate to default route (e.g., Home)
        this.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);
      }
    },

    _onRouteMatched: function (oEvent) {
      this.travelId = oEvent.getParameter("arguments").travelId;
      console.log("Loaded Travel ID in _onRouteMatched :", this.travelId);
      if (this.travelId !== "-") {
        //Enable / disable radio according to status
        this.byId("id_saveDraftRadio").setEnabled(false);
        this.byId("id_saveAndApproveRadio").setEnabled(false);
        this.byId("id_ApproveRadio").setEnabled(true);

        this.byId("id_ApproveRadio").setSelected(true);
        this.selectedOption = "Approve";

        const saveAndProceedButton = this.byId("saveAndProceed");
        saveAndProceedButton.setText("Send for Approval");


        const oModel = this.getOwnerComponent().getModel(); // OData V4 model
        const oContextBinding = oModel.bindContext(`/TravelRequests(${this.travelId})`);

        oContextBinding.requestObject().then((oData) => {
          const oJSONModel = new sap.ui.model.json.JSONModel(oData);
          this.getOwnerComponent().setModel(oJSONModel, "travelData");

        }).catch((oError) => {
          console.error("Failed to fetch specific travel request:", oError);
          sap.m.MessageBox.error("Error fetching data.");
        });
      } else {
        const oModel = this.getOwnerComponent().getModel("travelData");
       
        //Enable / disable radio according to status
        this.byId("id_saveDraftRadio").setEnabled(true);
        this.byId("id_saveAndApproveRadio").setEnabled(true);
        this.byId("id_ApproveRadio").setEnabled(false);

        this.byId("id_saveAndApproveRadio").setSelected(true);
        this.selectedOption = "SaveApprove";
        const saveAndProceedButton = this.byId("saveAndProceed");
        saveAndProceedButton.setText("Save and Send for Approval");

      }

      const travelData = this.getOwnerComponent().getModel("travelData");
      console.log("travelData -----------------");
      console.log(travelData);

      const formattedStartdate = travelData.getProperty("/startDate");
    },

    onActionSelect: function (oEvent) {
      const selectedIndex = oEvent.getParameter("selectedIndex");

      const saveAndProceedButton = this.byId("saveAndProceed");

      if (selectedIndex === 0) {
        saveAndProceedButton.setText("Save Draft");
        this.selectedOption = "draft";
      } else if (selectedIndex === 1) {
        saveAndProceedButton.setText("Save and Send for Approval");
        this.selectedOption = "SaveApprove";
      } else {
        saveAndProceedButton.setText("Send for Approval");
        this.selectedOption = "Approve";
      }
    },

    onSaveAndApprove: async function () {

      const travelData = this.getOwnerComponent().getModel("travelData");

      const formattedStartdate = travelData.getProperty("/startDate");
      const formattedEnddate = travelData.getProperty("/endDate");
      var departure = travelData.getProperty("/departure");
      var arrival = travelData.getProperty("/arrival");

      const formattedPostingDate = travelData.getProperty("/postingDate");
      const selfTravel = travelData.getProperty("/selfTravel");
      const placeOfVisit = travelData.getProperty("/placeOfVisit");
      var estimatedCosts = travelData.getProperty("/estimatedCost");
      var travelType = travelData.getProperty("/travelType");
      var purposeOfTravel = travelData.getProperty("/purposeOfTravel");
      const additionalTravellers = travelData.getProperty("/additionalTravellers");
      const advances = travelData.getProperty("/advances");
      const costAssignment = travelData.getProperty("/costAssignment");
      var travelId = crypto.randomUUID();
      var travelStatus = "Approve";

      if (this.selectedOption === "Approve") {
      //start workflow (Build process)
        const travelData = {
          id: this.travelId,
          employee: "EMP001",
          startdate: formattedStartdate,
          enddate: formattedEnddate,
          postingdate: formattedPostingDate,
          selftravel: selfTravel,
          placeofvisit: placeOfVisit,
          estimatedcost: estimatedCosts,
          action: "1",
          createdat: new Date().toISOString(),
          departure: departure,
          arrival: arrival,
          traveltype: travelType,
          purposeoftravel: purposeOfTravel,
          additionaltravellers: additionalTravellers,
          advances: advances,
          costassignment: costAssignment,
          status: travelStatus
        };

        console.log("travelData sent for approval ------------------");
        console.log(travelData);
      
        $.ajax({
          url: "/odata/v4/travel/startTravelWorkflow",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ travelData: JSON.stringify(travelData) }),
          success: function (response) {
            sap.m.MessageToast.show("Travel request " + this.travelId + " is send for approval.");
          },
          error: function (xhr, status, error) {
            sap.m.MessageBox.error("Failed to start workflow: " + xhr.responseText);
          }
        });

      


      } else if (this.selectedOption === "draft"){
        this.getView().setBusy(true);
        var oModel = this.getView().getModel(); // OData V4 model


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
          if (this.selectedOption === "draft") {
            sap.m.MessageToast.show("Travel request " + travelId + " is saved successfully.");
          } else if (this.selectedOption === "SaveApprove") {
            sap.m.MessageToast.show("Travel request " + travelId + " is saved successfully and send for approval.");
          } else if (this.selectedOption === "Approve") {
            sap.m.MessageToast.show("Travel request " + travelId + " is send for approval.");
          }

        }).catch((oError) => {
          sap.m.MessageBox.error("Error saving travel request: " + oError.message);
        }).finally(() => {
          // Hide loader
          this.getView().setBusy(false);
        });
      }else if (this.selectedOption === "SaveApprove"){
        //save the request and send to approval
        this.getView().setBusy(true);
        var oModel = this.getView().getModel(); // OData V4 model


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
              //start workflow (Build process)
              const travelData = {
                id: travelId,
                employee: "EMP001",
                startdate: formattedStartdate,
                enddate: formattedEnddate,
                postingdate: formattedPostingDate,
                selftravel: selfTravel,
                placeofvisit: placeOfVisit,
                estimatedcost: estimatedCosts,
                action: "1",
                createdat: new Date().toISOString(),
                departure: departure,
                arrival: arrival,
                traveltype: travelType,
                purposeoftravel: purposeOfTravel,
                additionaltravellers: additionalTravellers,
                advances: advances,
                costassignment: costAssignment,
                status: travelStatus
              };
            
              $.ajax({
                url: "/odata/v4/travel/startTravelWorkflow",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ travelData: JSON.stringify(travelData) }),
                success: function (response) {
                  sap.m.MessageToast.show("Travel request " + travelId + " is saved and send for approval.");
                },
                error: function (xhr, status, error) {
                  sap.m.MessageBox.error("Failed to start workflow: " + xhr.responseText);
                }
              });

      
        }).catch((oError) => {
          sap.m.MessageBox.error("Error saving travel request: " + oError.message);
        }).finally(() => {
          // Hide loader
          this.getView().setBusy(false);
        });
      }
    }
  });

});  