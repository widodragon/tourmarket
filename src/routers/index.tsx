import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Page } from './types';
import ScrollToTop from './ScrollToTop';
import Footer from 'shared/Footer/Footer';
import PageHome from 'containers/PageHome/PageHome';
import Page404 from 'containers/Page404/Page404';
import ListingStayPage from 'containers/ListingStayPage/ListingStayPage';
import ListingStayMapPage from 'containers/ListingStayPage/ListingStayMapPage';
import ListingExperiencesPage from 'containers/ListingExperiencesPage/ListingExperiencesPage';
import ListingExperiencesMapPage from 'containers/ListingExperiencesPage/ListingExperiencesMapPage';
import ListingStayDetailPage from 'containers/ListingDetailPage/ListingStayDetailPage';
import ListingExperiencesDetailPage from 'containers/ListingDetailPage/ListingExperiencesDetailPage';
import ListingCarPage from 'containers/ListingCarPage/ListingCarPage';
import ListingCarMapPage from 'containers/ListingCarPage/ListingCarMapPage';
import ListingCarDetailPage from 'containers/ListingDetailPage/ListingCarDetailPage';
import CheckOutPage from 'containers/CheckOutPage/CheckOutPage';
import PayPage from 'containers/PayPage/PayPage';
import AuthorPage from 'containers/AuthorPage/AuthorPage';
import AccountPage from 'containers/AccountPage/AccountPage';
import AccountPass from 'containers/AccountPage/AccountPass';
import AccountSavelists from 'containers/AccountPage/AccountSavelists';
import AccountBilling from 'containers/AccountPage/AccountBilling';
import PageContact from 'containers/PageContact/PageContact';
import PageAbout from 'containers/PageAbout/PageAbout';
import PageSignUp from 'containers/PageSignUp/PageSignUp';
import PageLogin from 'containers/PageLogin/PageLogin';
import PageSubcription from 'containers/PageSubcription/PageSubcription';
import BlogPage from 'containers/BlogPage/BlogPage';
import BlogSingle from 'containers/BlogPage/BlogSingle';
import PageAddListing1 from 'containers/PageAddListing1/PageAddListing1';
import PageAddListing2 from 'containers/PageAddListing1/PageAddListing2';
import PageAddListing3 from 'containers/PageAddListing1/PageAddListing3';
import PageAddListing4 from 'containers/PageAddListing1/PageAddListing4';
import PageAddListing5 from 'containers/PageAddListing1/PageAddListing5';
import PageAddListing6 from 'containers/PageAddListing1/PageAddListing6';
import PageAddListing7 from 'containers/PageAddListing1/PageAddListing7';
import PageAddListing8 from 'containers/PageAddListing1/PageAddListing8';
import PageAddListing9 from 'containers/PageAddListing1/PageAddListing9';
import PageAddListing10 from 'containers/PageAddListing1/PageAddListing10';
import PageHome2 from 'containers/PageHome/PageHome2';
import PrivacyPolicy from 'containers/PrivacyPolicy/PrivacyPolicy';
import TermOfUse from 'containers/TermsOfUse/TermOfUse';
import ContactSupport from 'containers/ContactSupport/ContactSupport';
import ListingRealEstateMapPage from 'containers/ListingRealEstatePage/ListingRealEstateMapPage';
import ListingRealEstatePage from 'containers/ListingRealEstatePage/ListingRealEstatePage';
import SiteHeader from 'containers/SiteHeader';
import ListingFlightsPage from 'containers/ListingFlightsPage/ListingFlightsPage';
import FooterNav from 'components/FooterNav';
import useWindowSize from 'hooks/useWindowResize';
import PageHome3 from 'containers/PageHome/PageHome3';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import {
  deleteLocalStorage,
  deleteUserStorage,
  getStorage,
  isLogin,
  setEmailLocalStorage,
  setLogin,
  setStorageLocalStorage,
} from 'utils/localStorage';
import { POST } from 'utils/apiHelper';
import { CONFIG_STR, CONFIG_TCS } from 'contains/contants';
import ReservationPage from 'containers/ReservationPage/ReservationPage';
import HistoryPage from 'containers/HistoryPage/HistoryPage';
import ListingEventDetailPage from 'containers/ListingDetailPage/ListingEventDetailPage';
import ListingEventProductPage from 'containers/ListingDetailPage/ListingEventProductPage';
import EventReservationPage from 'containers/ReservationPage/EventReservationPage';
import ForgetPage from 'containers/ForgetPage/ForgetPage';
import ChangePasswordPage from 'containers/ChangePasswordPage/ChangePasswordPage';
import ProductViewAll from 'containers/PageHome/ProductViewAll';
import jwt_decode from "jwt-decode";
import moment from 'moment';
import EventTargetPage from 'containers/DynamicPage/EventTargetPage';
import ReceiptPage from 'containers/Receipt/ReceiptPage';

export const pages: Page[] = [
  { path: '/', exact: true, component: PageHome3 },
  { path: '/#', exact: true, component: PageHome3 },
  { path: '/home-1-header-2', exact: true, component: PageHome },
  { path: '/home-2', component: PageHome2 },
  //
  { path: '/listing-stay', component: ListingStayPage },
  { path: '/event/:id', component: EventTargetPage },
  { path: '/listing-stay-map', component: ListingStayMapPage },
  { path: '/listing-stay-detail', component: ListingStayDetailPage },
  { path: '/listing-event-detail', component: ListingEventDetailPage },
  { path: '/listing-event-product', component: ListingEventProductPage },
  //
  {
    path: '/listing-experiences',
    component: ListingExperiencesPage,
  },
  {
    path: '/listing-experiences-map',
    component: ListingExperiencesMapPage,
  },
  {
    path: '/listing-experiences-detail',
    component: ListingExperiencesDetailPage,
  },
  //
  { path: '/listing-car', component: ListingCarPage },
  { path: '/listing-car-map', component: ListingCarMapPage },
  { path: '/listing-car-detail', component: ListingCarDetailPage },
  //
  { path: '/listing-real-estate-map', component: ListingRealEstateMapPage },
  { path: '/listing-real-estate', component: ListingRealEstatePage },
  //
  { path: '/listing-flights', component: ListingFlightsPage },
  //
  { path: '/pay-done', component: PayPage },
  //
  { path: '/author', component: AuthorPage },
  { path: '/reset-password', component: ChangePasswordPage },
  { path: '/account-password', component: AccountPass },
  { path: '/account-savelists', component: AccountSavelists },
  { path: '/account-billing', component: AccountBilling },
  //
  { path: '/blog', component: BlogPage },
  { path: '/blog-single', component: BlogSingle },
  //
  { path: '/add-listing-1', component: PageAddListing1 },
  { path: '/add-listing-2', component: PageAddListing2 },
  { path: '/add-listing-3', component: PageAddListing3 },
  { path: '/add-listing-4', component: PageAddListing4 },
  { path: '/add-listing-5', component: PageAddListing5 },
  { path: '/add-listing-6', component: PageAddListing6 },
  { path: '/add-listing-7', component: PageAddListing7 },
  { path: '/add-listing-8', component: PageAddListing8 },
  { path: '/add-listing-9', component: PageAddListing9 },
  { path: '/add-listing-10', component: PageAddListing10 },
  //
  { path: '/contact', component: PageContact },
  { path: '/about', component: PageAbout },
  { path: '/subscription', component: PageSubcription },
  { path: '/forgot-pass', component: ForgetPage },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/term-of-use', component: TermOfUse },
  { path: '/contact-support', component: ContactSupport },
  { path: '/listing-view', component: ProductViewAll },
  { path: '/reservation', component: ReservationPage },
  { path: '/event-reservation', component: EventReservationPage },
  { path: '/receipt/:id', component: ReceiptPage }
  //
];

const AuthMiddleware = (props: any) => {
  const ParentComponent = props.component;
  if (isLogin()) {
    let decodeToken: any = jwt_decode(isLogin());
    const time = new Date(0);
    let now = new Date();
    time.setUTCSeconds(decodeToken?.exp);
    let expiredToken = moment(time)
    let nowDate = moment(now)
    if (expiredToken <= nowDate) {
      setEmailLocalStorage("");
      deleteLocalStorage(CONFIG_TCS);
      deleteUserStorage();
      setLogin(false);
      return <PageLogin />;
    } else {
      if (
        props.location.pathname === '/login' ||
        props.location.pathname === '/signup'
      ) {
        return <PageHome3 />;
      }
      return <ParentComponent {...props} />;
    }
  }
  if (props.location.pathname === '/signup' && !isLogin()) {
    return <ParentComponent {...props} />;
  }
  return <PageLogin />;
};

const Routes = () => {
  const WIN_WIDTH = useWindowSize().width || window.innerWidth;
  const [loading, setLoading] = React.useState(false);
  const [isReceipt, setReceipt] = React.useState(false);
  React.useEffect(() => {
    // getConfigWeb();
  }, []);

  React.useEffect(() => {
    if (window !== undefined) {
      console.log(window +  window.location.href.split("/")[3])
      // if (window.location.href.split("/")[3] === "receipt") {
      //   setReceipt(true);
      // }
    }
  }, []);

  const getConfigWeb = () => {
    setLoading(true);
    var host = window.location.host;
    let body = {
      websiteUrl: host,
      isActive: true,
    };
    POST('/website-config/list/index', body)
      .then((res) => {
        if (res) {
          setStorageLocalStorage(CONFIG_STR, res.result[0]);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  if (loading) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/">
          {/* {!isReceipt && <ScrollToTop />}
          {!isReceipt && <SiteHeader />} */}

          <Switch>
            {pages.map(({ component, path, exact }) => {
              return (
                <Route
                  key={path}
                  component={component}
                  exact={!!exact}
                  path={path}
                />
              );
            })}
            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: AccountPage })
              }
              path="/account"
            />
            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: CheckOutPage })
              }
              path="/checkout"
            />
            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: HistoryPage })
              }
              path="/history"
            />

            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: AccountPass })
              }
              path="/change-password"
            />

            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: PageLogin })
              }
              path="/login"
            />
            <Route
              children={(props: any) =>
                AuthMiddleware({ ...props, component: PageSignUp })
              }
              path="/signup"
            />

            <Route component={Page404} />
          </Switch>

          {/* {WIN_WIDTH < 768 && !isReceipt && <FooterNav />} */}
          {/* {!isReceipt && <Footer />} */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default Routes;
