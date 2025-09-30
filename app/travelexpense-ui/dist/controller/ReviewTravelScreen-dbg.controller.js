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

        this.getView().setBusy(true);

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

          console.log(oData);
          const Approvedstatus = oData.Approvedstatus;
          console.log("Approvedstatus " + Approvedstatus);
          console.log("status " + oData.status);

          var oText = this.byId("id_ApprovedText");
          var oStatus = this.byId("id_Approvedstatus");
          var oText_2 = this.byId("id_ApprovedText_2");
          var oStatus_2 = this.byId("id_Approvedstatus_2");


          if (Approvedstatus === "Draft" || Approvedstatus === undefined || Approvedstatus === null || Approvedstatus === "") {
            this.byId("finalActionBlock").setVisible(true);
            this.byId("txt_description").setText("Kindly review the information of this travel request before proceeding.");
            // Remove any previous classes
            oText.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
            oStatus.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");
            oText_2.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
            oStatus_2.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");

            // Add new active classes

            oText.addStyleClass("stepCircleDisabled");
            oStatus.addStyleClass("stepTextDisabled");
            oText_2.addStyleClass("stepCircleCurrent");
            oStatus_2.addStyleClass("stepTextCurrent");
          } else {
            this.byId("finalActionBlock").setVisible(false);
            this.byId("txt_description").setText("Below are the details of your selected travel request.");



            if (Approvedstatus === "Approved" || Approvedstatus === "Rejected") {


              // Remove any previous classes
              oText.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
              oStatus.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");
              oText_2.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
              oStatus_2.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");

              // Add new active classes

              oText.addStyleClass("stepCircleActive");
              oStatus.addStyleClass("stepTextActive");
              oText_2.addStyleClass("stepCircleActive");
              oStatus_2.addStyleClass("stepTextActive");


            } else {


              // Remove any previous classes
              oText.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
              oStatus.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");
              oText_2.removeStyleClass("stepCircleCurrent stepCircleDisabled stepCircleActive");
              oStatus_2.removeStyleClass("stepTextCurrent stepTextDisabled stepTextActive");

              // Add new active classes

              oText.addStyleClass("stepCircleDisabled");
              oStatus.addStyleClass("stepTextDisabled");
              oText_2.addStyleClass("stepCircleCurrent");
              oStatus_2.addStyleClass("stepTextCurrent");
            }
          }
          this.getView().setBusy(false);

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
        this.byId("finalActionBlock").setVisible(true);
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

      console.log("estimatedCosts-- 114");
      console.log(estimatedCosts);


      if (this.selectedOption === "Approve") { //only send for approval.. travel request is already saved as status "Draft".. now just update the status of travel request as "approve"
        this.getView().setBusy(true);


        var oModel = this.getView().getModel(); // your OData V4 model
        const travelId = this.travelId;
        const view = this.getView();
        // Bind to the entity
        var oBinding = oModel.bindContext("/TravelRequests('" + this.travelId + "')", undefined, {
          $$updateGroupId: "travelUpdateGroup"
        });

        // Get context asynchronously
        oBinding.requestObject().then(function () {
          var oContext = oBinding.getBoundContext();

          if (oContext) {
            oContext.setProperty("status", "Approved");
            oContext.setProperty("Approvedstatus", "Awaiting Approval")

            // Submit the batch
            oModel.submitBatch("travelUpdateGroup")
              .then(function () {

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
                  status: "Approved"
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
                    view.setBusy(false);
                    that.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);
                  },
                  error: function (xhr, status, error) {
                    sap.m.MessageBox.error("Failed to start workflow: " + xhr.responseText);
                    view.setBusy(false);
                  }
                });


              })
              .catch(function (oError) {

                sap.m.MessageBox.error("Failed to update status: " + oError.message);
              })
          } else {
            this.getView().setBusy(false);

            sap.m.MessageBox.error("No bound context found for Travel ID " + this.travelId);
          }
        });




      } else if (this.selectedOption === "draft") {    //travel request is not saved yet.. so now save.. don't send for approval
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
          status: "Draft"
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
          that.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);
        }).catch((oError) => {
          sap.m.MessageBox.error("Error saving travel request: " + oError.message);
        }).finally(() => {
          // Hide loader
          this.getView().setBusy(false);
          that.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);

        });
      } else if (this.selectedOption === "SaveApprove") { //travel request is not saved yet.. so now save and then send for approval
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
          status: "Approved",
          Approvedstatus: "Awaiting Approval"
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
            status: "Approved"
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

          that.getOwnerComponent().getRouter().navTo("RouteCreateTravelRequest", true);

        });
      }
    }
  });

});  