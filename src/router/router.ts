type RouteHandler = (params: {[param: string]: string}) => void;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RouteConfiguration {
    method: HttpMethod;
    path: string;
    handler: RouteHandler;
}

interface ResolvedRoute {
    handler: RouteHandler,
    paramValues: {[param: string]: string}
}

interface RouteSegment {
    name?: string;
    handler?: RouteHandler;
    segments: { [segmentName: string]: RouteSegment }
}

export class Router {
    private routeMap: { [method: string]: RouteSegment } = {};

    constructor(routes: RouteConfiguration[]) {
        this.buildRouteMap(routes);
    }

    resolveRoute(httpMethod: string, path: string): ResolvedRoute | null {
        const pathSegments = path.split('/').filter(x => x);
        const paramValues = {};
        let currentSegmentConfig = this.routeMap[httpMethod];
        let pathSegment;
        while (pathSegment = pathSegments.shift()) {
            currentSegmentConfig = currentSegmentConfig.segments[pathSegment];
            if (!currentSegmentConfig) {
                return null;
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
            let segmentName;
            while (segmentName = pathSegmentsNames.shift()) {
                currentSegment.segments[segmentName] = currentSegment.segments[segmentName] || { segments: {} };
                currentSegment = currentSegment.segments[segmentName];
            }
            currentSegment.handler = handler;
        }
    }
}