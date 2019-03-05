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

define(['require', 'log', 'jquery', 'lodash', 'partitionWith', 'jsonValidator', 'handlebar', 'constants'],
    function (require, log, $, _, PartitionWith, JSONValidator, Handlebars, Constants) {

        /**
         * @class PartitionForm Creates a forms to collect data from a partition
         * @constructor
         * @param {Object} options Rendering options for the view
         */
        var PartitionForm = function (options) {
            if (options !== undefined) {
                this.configurationData = options.configurationData;
                this.application = options.application;
                this.consoleListManager = options.application.outputController;
                this.formUtils = options.formUtils;
                this.jsPlumbInstance = options.jsPlumbInstance;
                var currentTabId = this.application.tabController.activeTab.cid;
                this.designViewContainer = $('#design-container-' + currentTabId);
                this.toggleViewButton = $('#toggle-view-button-' + currentTabId);
            }
        };

        /**
         * Function to check if the connected streams are filled
         * @param {Object} partitionWithList
         * @return {boolean} isFilled
         */
        var ifStreamsAreFilled = function (partitionWithList) {
            var isFilled = false;
            for (var partitionKey of partitionWithList) {
                if (partitionKey.getStreamName()) {
                    isFilled = true;
                    break;
                }
            }
            return isFilled;
        };

        /**
         * @function generate form for Partition
         * @param element selected element(partition)
         * @param formConsole Console which holds the form
         * @param formContainer Container which holds the form
         */
        PartitionForm.prototype.generatePropertiesForm = function (element, formConsole, formContainer) {
            var self = this;
            var id = $(element).parent().attr('id');
            var clickedElement = self.configurationData.getSiddhiAppConfig().getPartition(id);
            var partitionWithList = clickedElement.getPartitionWith();

            if (!partitionWithList || partitionWithList.length === 0) {
                $("#" + id).addClass('incomplete-element');
                $('#' + id).prop('title', 'Connect a stream for partitioning');

                // design view container and toggle view button are enabled
                self.designViewContainer.removeClass('disableContainer');
                self.toggleViewButton.removeClass('disableContainer');
                // close the form window
                self.consoleListManager.removeFormConsole(formConsole);
            } else {
                if (!ifStreamsAreFilled(partitionWithList)) {
                    $("#" + id).addClass('incomplete-element');
                    $('#' + id).prop('title', 'To edit partition configuration, fill the connected stream.');

                    // design view container and toggle view button are enabled
                    self.designViewContainer.removeClass('disableContainer');
                    self.toggleViewButton.removeClass('disableContainer');
                    // close the form window
                    self.consoleListManager.removeFormConsole(formConsole);
                } else {
                    var propertyDiv = $('<div id="property-header"><h3>Partition Configuration</h3></div>' +
                        '<div class = "partition-form-container"> <div id = "define-partition-keys"> </div> ' +
                        self.formUtils.buildFormButtons() + '</div>' +
                        '<div class = "partition-form-container"> <div id = "define-annotation"> </div> </div>');

                    formContainer.append(propertyDiv);
                    self.formUtils.popUpSelectedElement(id);
                    // design view container and toggle view button are enabled
                    self.designViewContainer.addClass('disableContainer');
                    self.toggleViewButton.addClass('disableContainer');

                    var savedAnnotations = [];
                    savedAnnotations = clickedElement.getAnnotationListObjects();
                    self.formUtils.renderAnnotationTemplate("define-annotation", savedAnnotations);

                    var partitionKeys = [];
                    for (var i = 0; i < partitionWithList.length; i++) {
                        if (partitionWithList[i].getStreamName()) {
                            var partitionKey = {
                                expression: partitionWithList[i].getExpression(),
                                streamName: partitionWithList[i].getStreamName()
                            };
                            partitionKeys.push(partitionKey);
                        }
                    }
                    var partitionFormTemplate = Handlebars.compile($('#partition-by-template').html());
                    var wrappedHtml = partitionFormTemplate(partitionKeys);
                    $('#define-partition-keys').html(wrappedHtml);

                    // 'Submit' button action
                    var submitButtonElement = $(formContainer).find('#btn-submit')[0];
                    submitButtonElement.addEventListener('click', function () {

                        //clear the error classes
                        $('.error-message').text("")
                        $('.required-input-field').removeClass('required-input-field');
                        var isErrorOccurred = false;

                        var partitionKeys = [];
                        $('#partition-by-content .partition-key').each(function () {
                            var expression = $(this).find('.partition-by-expression').val().trim();
                            if (expression === "") {
                                self.formUtils.addErrorClass($(this).find('.partition-by-expression'));
                                $(this).find('.error-message').text("Expression value is required.")
                                isErrorOccurred = true;
                                return false;
                            } else {
                                var streamName = $(this).find('.partition-by-stream-name').val().trim();
                                var partitionKey = {
                                    expression: expression,
                                    streamName: streamName
                                };
                                partitionKeys.push(partitionKey);
                            }
                        });

                        if (!isErrorOccurred) {
                            clickedElement.clearPartitionWith();
                            _.forEach(partitionKeys, function (partitionKey) {
                                var partitionWithObject = new PartitionWith(partitionKey);
                                clickedElement.addPartitionWith(partitionWithObject);
                            });

                            var isValid = JSONValidator.prototype.validatePartition(clickedElement, self.jsPlumbInstance,
                                false);
                            if (!isValid) {
                                return;
                            }

                            clickedElement.clearAnnotationList();
                            clickedElement.clearAnnotationListObjects();
                            var annotationStringList = [];
                            var annotationObjectList = [];
                            var annotationNodes = $('#annotation-div').jstree(true)._model.data['#'].children;
                            self.formUtils.buildAnnotation(annotationNodes, annotationStringList, annotationObjectList);
                            _.forEach(annotationStringList, function (annotation) {
                                clickedElement.addAnnotation(annotation);
                            });
                            _.forEach(annotationObjectList, function (annotation) {
                                clickedElement.addAnnotationObject(annotation);
                            });


                            $('#' + id).removeClass('incomplete-element');
                            //Send partition element to the backend and generate tooltip
                            var partitionToolTip = self.formUtils.getTooltip(clickedElement, Constants.PARTITION);
                            $('#' + id).prop('title', partitionToolTip);

                            // set the isDesignViewContentChanged to true
                            self.configurationData.setIsDesignViewContentChanged(true);
                            // design view container and toggle view button are enabled
                            self.designViewContainer.removeClass('disableContainer');
                            self.toggleViewButton.removeClass('disableContainer');
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
                }
            }
        };

        return PartitionForm;
    });

