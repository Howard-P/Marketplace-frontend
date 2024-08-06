import {
  ApplicationInsights,
  ITelemetryItem,
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const reactPlugin = new ReactPlugin();
// *** Add the Click Analytics plug-in. ***
/* var clickPluginInstance = new ClickAnalyticsPlugin();
   var clickPluginConfig = {
     autoCapture: true
}; */
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      "InstrumentationKey=d0626b42-b7ec-46b6-a9bc-ae036ce14405;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=c108addb-500f-44af-8f68-b1df04798318",
    // *** If you're adding the Click Analytics plug-in, delete the next line. ***
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    // *** Add the Click Analytics plug-in. ***
    // extensions: [reactPlugin, clickPluginInstance],
    // *** Add the Click Analytics plug-in. ***
    // [clickPluginInstance.identifier]: clickPluginConfig
  },
});

appInsights.loadAppInsights();
appInsights.trackPageView(); //optional

appInsights.addTelemetryInitializer((env: ITelemetryItem) => {
  env.tags = env.tags || [];
  env.tags["ai.cloud.role"] = "testTag";
});

export { reactPlugin, appInsights };
