import { ResolvedRoute, RouteConfiguration, RouteHandler } from "./interfaces";

interface RouteSegment {
    paramName?: string;
    handler?: RouteHandler;
    segments: { [segmentName: string]: RouteSegment }
}

const PARAM_SEGMENT_KEY = "{param}";

export class Router {
    private routeMap: { [method: string]: RouteSegment } = {};

    constructor(routes: RouteConfiguration[]) {
        this.buildRouteMap(routes);
    }

    resolveRoute(httpMethod: string, path: string): ResolvedRoute | null {
        const pathSegments = path.split('/').filter(x => x);
        const paramValues: {[param: string]: string} = {};
        let currentSegmentConfig = this.routeMap[httpMethod];
        let pathSegmentValue;
        while (pathSegmentValue = pathSegments.shift()) {
            currentSegmentConfig = currentSegmentConfig.segments[pathSegmentValue] 
                || currentSegmentConfig.segments[PARAM_SEGMENT_KEY];
            if (!currentSegmentConfig) {
                return null;
            }
            if (currentSegmentConfig.paramName) {
                paramValues[currentSegmentConfig.paramName] = pathSegmentValue;
            }
        }
        if (!currentSegmentConfig.handler) {
            return null;
        }
        return {
            handler: currentSegmentConfig.handler,
            paramValues,
        };
    }

    private buildRouteMap(routes: RouteConfiguration[]) {
        for (const route of routes) {
            const { method, path, handler } = route;
            const methodRoutesMap = this.routeMap[method] = this.routeMap[method] || { segments: {} };
            const pathSegmentsNames = path.split('/');

            let currentSegment = methodRoutesMap;
            let segmentName: string | undefined;
            while (segmentName = pathSegmentsNames.shift()) {
                const isParamSegment = segmentName.startsWith('{');
                const segmentKey = isParamSegment ? PARAM_SEGMENT_KEY : segmentName;
                currentSegment.segments[segmentKey] = currentSegment.segments[segmentKey] || { segments: {} };
                currentSegment = currentSegment.segments[segmentKey];
                if (isParamSegment) {
                    const paramNameWithoutBrackets = segmentName.slice(1, segmentName.length - 1);
                    currentSegment.paramName = paramNameWithoutBrackets;
                }
            }
            currentSegment.handler = handler;
        }
    }
}