import { ComponentType } from 'react';

export interface LocationStates {
  '/'?: {};
  '/#'?: {};
  '/home-2'?: {};
  '/home-3'?: {};
  '/home-1-header-2'?: {};
  //
  '/listing-flights'?: {};
  //
  '/listing-stay'?: {};
  '/listing-stay-map'?: {};
  '/listing-stay-detail'?: {};
  //
  '/listing-experiences'?: {};
  '/listing-experiences-map'?: {};
  '/listing-experiences-detail'?: {};
  //
  '/listing-real-estate'?: {};
  '/listing-real-estate-map'?: {};
  '/listing-real-estate-detail'?: {};
  //
  '/listing-car'?: {};
  '/listing-car-map'?: {};
  '/listing-car-detail'?: {};
  //
  '/checkout'?: {};
  '/pay-done'?: {};
  //
  '/account'?: {};
  '/reset-password'?: {};
  '/account-savelists'?: {};
  '/account-password'?: {};
  '/account-billing'?: {};
  //
  '/blog'?: {};
  '/blog-single'?: {};
  //
  '/add-listing-1'?: {};
  '/add-listing-2'?: {};
  '/add-listing-3'?: {};
  '/add-listing-4'?: {};
  '/add-listing-5'?: {};
  '/add-listing-6'?: {};
  '/add-listing-7'?: {};
  '/add-listing-8'?: {};
  '/add-listing-9'?: {};
  '/add-listing-10'?: {};
  //
  '/author'?: {};
  '/search'?: {};
  '/about'?: {};
  '/contact'?: {};
  '/login'?: {};
  '/signup'?: {};
  '/forgot-pass'?: {};
  '/page404'?: {};
  '/subscription'?: {};
  '/reservation'?: {};
  '/listing-event-detail'?: {};
  '/listing-event-product'?: {};
  '/privacy-policy'?: {};
  '/term-of-use'?: {};
  '/contact-support'?: {};
  '/listing-view'?: {};
  '/event-reservation'?: {},
  '/event/:id'?: {},
  '/receipt/:id'?: {}
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: any;
}
