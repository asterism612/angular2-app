import {
  RouterOutletMap,
  UrlSerializer,
  DefaultUrlSerializer,
  Router,
  ActivatedRoute,
  RouterConfig
} from "@angular/router";
import {SpyLocation} from "@angular/common/testing";
import {LocationStrategy} from "@angular/common";
import {ComponentResolver, Injector, Type} from "@angular/core";

class MockLocationStrategy {
  internalBaseHref:string = '/';

  prepareExternalUrl(internal:string):string {
    if (internal.startsWith('/') && this.internalBaseHref.endsWith('/')) {
      return this.internalBaseHref + internal.substring(1);
    }
    return this.internalBaseHref + internal;
  }

}

export const provideFakeRouter = (rootComponentType:Type, config:RouterConfig = []) => {
  return [
    RouterOutletMap,
    {provide: UrlSerializer, useClass: DefaultUrlSerializer},
    {provide: Location, useClass: SpyLocation},
    {provide: LocationStrategy, useClass: MockLocationStrategy},
    {
      provide: Router,
      useFactory: (resolver:ComponentResolver, urlSerializer:UrlSerializer,
                   outletMap:RouterOutletMap, location:Location, injector:Injector) => {
        return new Router(
          rootComponentType, resolver, urlSerializer, outletMap, location, injector, config);
      },
      deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
    },
    {
      provide: ActivatedRoute,
      useFactory: (r:Router) => r.routerState.root,
      deps: [Router]
    },
  ]
};
