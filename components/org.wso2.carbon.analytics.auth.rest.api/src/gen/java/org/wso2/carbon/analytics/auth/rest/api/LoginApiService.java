/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.carbon.analytics.auth.rest.api;

import org.wso2.msf4j.Request;

import javax.ws.rs.core.Response;

/**
 * Login API Service class.
 */
public abstract class LoginApiService {
    public abstract Response loginAppNamePost(String appName
            , String username
            , String password
            , String grantType
            , Boolean rememberMe
            , String appId
            , Request request) throws NotFoundException;

    public abstract Response loginCallbackAppNameGet(String appName, String authentication
            , Request request) throws NotFoundException;

    public abstract Response isSSOEnabled();
}
