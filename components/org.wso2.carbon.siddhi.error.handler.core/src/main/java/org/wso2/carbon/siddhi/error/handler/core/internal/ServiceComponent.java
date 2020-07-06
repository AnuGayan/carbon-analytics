/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.siddhi.error.handler.core.internal;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.carbon.streaming.integrator.common.SiddhiAppRuntimeService;
import org.wso2.msf4j.MicroservicesServer;

/**
 * Service Component of Siddhi Error Handler Core.
 */
@Component(
    service = ServiceComponent.class,
    immediate = true
)
public class ServiceComponent {

    private static final Logger logger = LoggerFactory.getLogger(ServiceComponent.class);

    @Activate
    protected void start(BundleContext bundleContext) {
        logger.info("Siddhi Error Handler Core Startup Listener Service Component is Activated.");
    }

    @Deactivate
    protected void stop() {
        logger.info("Siddhi Error Handler Core Startup Listener Service Component is Deactivated.");
    }

    @Reference(service = MicroservicesServer.class,
        cardinality = ReferenceCardinality.AT_LEAST_ONE,
        policy = ReferencePolicy.DYNAMIC,
        unbind = "unsetMicroservicesServer")
    protected void setMicroservicesServer(MicroservicesServer microservicesServer) {
        logger.debug("Microservices server registered to startup component of server.");
    }

    protected void unsetMicroservicesServer(MicroservicesServer microservicesServer) {
        logger.debug("Microservices server unregistered from startup component of server.");
    }

    @Reference(service = SiddhiAppRuntimeService.class,
        cardinality = ReferenceCardinality.MANDATORY,
        policy = ReferencePolicy.DYNAMIC,
        unbind = "unsetSiddhiAppRuntimeService")
    protected void setSiddhiAppRuntimeService(SiddhiAppRuntimeService siddhiAppRuntimeService) {
        SiddhiErrorHandlerDataHolder.getInstance().setSiddhiAppRuntimeService(siddhiAppRuntimeService);
    }

    protected void unsetSiddhiAppRuntimeService(SiddhiAppRuntimeService siddhiAppRuntimeService) {
        SiddhiErrorHandlerDataHolder.getInstance().setSiddhiAppRuntimeService(null);
    }

}
