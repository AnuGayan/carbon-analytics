/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

define(['require', 'log', 'jquery', 'lodash', 'constants'],
    function (require, log, $, _, Constants) {

        /**
         * @class FunctionForm Creates a forms to collect data from a function
         * @constructor
         * @param {Object} options Rendering options for the view
         */
        var FunctionForm = function (options) {
            if (options !== undefined) {
                this.configurationData = options.configurationData;
                this.application = options.application;
                this.formUtils = options.formUtils;
                this.consoleListManager = options.application.outputController;
                var currentTabId = this.application.tabController.activeTab.cid;
                this.designViewContainer = $('#design-container-' + currentTabId);
                this.toggleViewButton = $('#toggle-view-button-' + currentTabId);
            }
        };

        /**
         * @function renders the script types
         */
        var renderScriptType = function () {
            var scriptDiv = '<h4> Script Type: </h4> <select id = "script-type">' +
                '<option value = "Javascript"> Javascript </option>' +
                '<option value = "Scala"> Scala </option>' +
                '<option value = "R"> R </option>' +
                '</select>';
            $('#function-script-type').html(scriptDiv);
        };

        /**
         * @function renders the return type of the script
         */
        var renderReturnType = function () {
            var returnDiv = '<h4> Return Type: </h4> <select id = "return-type">' +
                '<option value = "int"> int </option>' +
                '<option value = "long"> long </option>' +
                '<option value = "double"> double </option>' +
                '<option value = "float"> float </option>' +
                '<option value = "string"> string </option>' +
                '<option value = "bool"> bool </option>' +
                '<option value = "object"> object </option>' +
                '</select>';
            $('#function-return-type').html(returnDiv);
        };

        /**
         * @function generate properties form for a function
         * @param element selected element(function)
         * @param formConsole Console which holds the form
         * @param formContainer Container which holds the form
         */
        FunctionForm.prototype.generatePropertiesForm = function (element, formConsole, formContainer) {
            var self = this;
            var id = $(element).parent().attr('id');
            var clickedElement = self.configurationData.getSiddhiAppConfig().getFunction(id);
            var propertyDiv = $('<div id="property-header"><h3>Function Configuration</h3></div>' +
                '<div class = "function-form-container"> <div id = "define-function-name"> <h4> Name </h4> ' +
                '<input type="text" id="functionName" class="clearfix"><label class = "error-message" ' +
                'id = "functionNameErrorMessage"> </label></div>' +
                '<div id = "function-script-type"> </div> <div id= "function-return-type"> </div>' +
                self.formUtils.buildFormButtons() + '</div>' +
                '<div class = "function-form-container"> <div id="define-script-body"> <h4> Script Body: </h4> ' +
                '<textarea id= "script-body-content" rows="5" cols="50"> </textarea> <label class = "error-message">' +
                '</label> </div> </div>');

            formContainer.append(propertyDiv);
            self.formUtils.popUpSelectedElement(id);
            self.designViewContainer.addClass('disableContainer');
            self.toggleViewButton.addClass('disableContainer');

            var name = clickedElement.getName();
            renderScriptType();
            renderReturnType();
            if (name) {
                //if the function object is already edited
                var scriptType = (clickedElement.getScriptType()).toLowerCase();
                var returnType = (clickedElement.getReturnType()).toLowerCase();
                var body = clickedElement.getBody().trim();

                //populate the saved values
                $('#functionName').val(name.trim());
                $('#function-script-type').find('#script-type option').filter(function () {
                    return ($(this).val().toLowerCase() == (scriptType.toLowerCase()));
                }).prop('selected', true);
                $('#function-return-type').find('#return-type option').filter(function () {
                    return ($(this).val().toLowerCase() == (returnType.toLowerCase()));
                }).prop('selected', true);
                $('#script-body-content').val(body);

            }

            // 'Submit' button action
            var submitButtonElement = $(formContainer).find('#btn-submit')[0];
            submitButtonElement.addEventListener('click', function () {

                //clear the error classes
                $('.error-message').text("");
                $('.required-input-field').removeClass('required-input-field');
                var isErrorOccurred = false;

                var functionName = $('#functionName').val().trim();
                var previouslySavedName = clickedElement.getName();
                if (functionName === "") {
                    self.formUtils.addErrorClass($('#functionName'));
                    $('#functionNameErrorMessage').text("Function name is required.");
                    isErrorOccurred = true;
                    return;
                }
                if (!previouslySavedName) {
                    previouslySavedName = "";
                }
                if (previouslySavedName !== functionName) {
                    var isFunctionNameUsed = self.formUtils.isFunctionDefinitionElementNameUsed(functionName, id);
                    if (isFunctionNameUsed) {
                        self.formUtils.addErrorClass('#functionName');
                        $('#functionNameErrorMessage').text("Function name is already used.");
                        isErrorOccurred = true;
                        return;
                    }
                    if (self.formUtils.validateAttributeOrElementName("#functionName", Constants.FUNCTION, functionName)) {
                        isErrorOccurred = true;
                        return;
                    }
                }

                var scriptBody = $('#script-body-content').val().trim();
                if (scriptBody === "") {
                    self.formUtils.addErrorClass('#script-body-content');
                    $('#define-script-body').find('.error-message').text("Script body is required.");
                    isErrorOccurred = true;
                    return;
                }

                if (!isErrorOccurred) {
                    if (previouslySavedName !== functionName) {
                        // update selected trigger model
                        clickedElement.setName(functionName);
                        self.formUtils.updateConnectionsAfterDefinitionElementNameChange(id);
                        var textNode = $(element).parent().find('.functionNameNode');
                        textNode.html(functionName);
                    }
                    var scriptType = $('#script-type').val();
                    var returnType = $('#return-type').val();
                    clickedElement.setScriptType(scriptType.toUpperCase());
                    clickedElement.setReturnType(returnType.toUpperCase());
                    clickedElement.setBody(scriptBody);

                    $('#' + id).removeClass('incomplete-element');
                    //Send function element to the backend and generate tooltip
                    var functionToolTip = self.formUtils.getTooltip(clickedElement, Constants.FUNCTION);
                    $('#' + id).prop('title', functionToolTip);

                    self.designViewContainer.removeClass('disableContainer');
                    self.toggleViewButton.removeClass('disableContainer');
                    // set the isDesignViewContentChanged to true
                    self.configurationData.setIsDesignViewContentChanged(true);
                    // close the form window
                    self.consoleListManager.removeFormConsole(formConsole);
                }
            });

            // 'Cancel' button action
            var cancelButtonElement = $(formContainer).find('#btn-cancel')[0];
            cancelButtonElement.addEventListener('click', function () {
                self.designViewContainer.removeClass('disableContainer');
                self.toggleViewButton.removeClass('disableContainer');
                // close the form window
                self.consoleListManager.removeFormConsole(formConsole);
            });
        };

        return FunctionForm;
    });


