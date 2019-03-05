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

/**
 * Constants to be used by the siddhi editor  design view
 */
define(function () {

    "use strict";   // JS strict mode

    /**
     * Constants used by the siddhi editor design-view
     */
    var constants = {
        ALPHABETIC_VALIDATOR_REGEX: /^([a-zA-Z])$/,
        START: "start",
        CRON_EXPRESSION: "cron-expression",
        EVERY: "every",
        AT: "at",
        SORT: "sort",
        FREQUENT: "frequent",
        LOSSY_FREQUENT: "lossyfrequent",
        DEFAULT_STORE_TYPE: "in-memory",
        RDBMS_STORE_TYPE: "rdbms",
        DEFAULT_MAPPER_TYPE: "passThrough",
        ATTRIBUTE: "attribute",
        MAP: "map",
        LIST: "list",
        MAPPER: "mapper",
        STORE: "store",
        AGGREGATION: "aggregation",
        FUNCTION: "function",
        SINK: "sink",
        SOURCE: "source",
        TABLE: "table",
        STREAM: "stream",
        WINDOW: "window",
        TRIGGER: "trigger",
        PARTITION: "partition",
        JOIN_QUERY: "join-query",
        PATTERN_QUERY: "pattern-query",
        SEQUENCE_QUERY: "sequence-query",
        WINDOW_FILTER_PROJECTION_QUERY: "window-filter-projection-query",
        TYPE_HTTP_REQUEST: "http-request",
        TYPE_HTTP_RESPONSE: "http-response",
    };

    return constants;
});