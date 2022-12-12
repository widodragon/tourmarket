import { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { decode, encode } from 'js-base64';
import _ from 'lodash';
import { sha512 } from 'js-sha512';

import convertNumbThousand from 'utils/convertNumbThousand';
import { POST } from 'utils/apiHelper';
import { message } from 'utils/message';
import {
  getRequestInquiry,
  getTitleWebsite,
  getUserStorage,
  setRequestInquiry,
} from 'utils/localStorage';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import 'moment/locale/id';
import * as transactionActions from 'redux/actions/transaction';

export interface CheckOutPageProps {
  className?: string;
}

const CheckOutPage: FC<CheckOutPageProps> = ({ className = '' }) => {
  const dispatch: any = useDispatch();
  const location: any = useLocation();
  const [bookingDataEncode, setBookingDataEncode] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>([]);

  useEffect(() => {
    let { data } = location.state;
    if (data) {
      let body: any = JSON.parse(decode(data));
      let user = getUserStorage();
      let newBody = {
        header: {
          ...body?.body?.header,
          customerCID: user?.cid,
          customerHirarki: user?.hirarki,
          customerName: user?.name,
          customerEmail: user?.email,
          customerPhone: user?.phone,
        },
        detail: body?.body?.detail,
      };
      requestInquiryAPI(newBody);
    }
  }, []);

  const requestInquiryAPI = async (body: any) => {
    try {
      const response = await POST('/bookingv2/inquiry', body);

      if (response.success) {
        setBookingDataEncode(encode(JSON.stringify(response.result)));
        setRequestInquiry(body);
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      message('error', error.message);
    }
  };
  useEffect(() => {
    if (bookingDataEncode) {
      let bookingDataDecode = JSON.parse(decode(bookingDataEncode));
      let groupedByVisitorName = _.groupBy(
        bookingDataDecode.detail,
        (detail) => detail.visitorName
      );
      setBookingData(groupedByVisitorName);
      loadPaymentSDK();
    }
    //clean SDK
    return () => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        // development SDK
        // removeScript(process.env.REACT_APP_URL_PAYMENT_TEMPLATE_DEV);
        // removeScript(process.env.REACT_APP_URL_PAYMENT_LIB_DEV);
        // removeCss(process.env.REACT_APP_URL_PAYMENT_CSS_DEV);

        removeScript(process.env.REACT_APP_URL_PAYMENT_TEMPLATE_PROD);
        removeScript(process.env.REACT_APP_URL_PAYMENT_LIB_PROD);
        removeCss(process.env.REACT_APP_URL_PAYMENT_CSS_PROD);
      } else {
        // production SDK
        removeScript(process.env.REACT_APP_URL_PAYMENT_TEMPLATE_PROD);
        removeScript(process.env.REACT_APP_URL_PAYMENT_LIB_PROD);
        removeCss(process.env.REACT_APP_URL_PAYMENT_CSS_PROD);
      }
    };
  }, [bookingDataEncode]);

  const confirmationPayment = async (
    mKey: any,
    bookingRef: any,
    paymentCategory: any
  ) => {
    const body = {
      merchantKey: mKey,
      bookingRef: bookingRef,
      paymentCategory: paymentCategory,
    };

    const response = await POST('/bookingv2/confirmation', body);

    try {
      if (response.success) {
        let bookingDataEncode = encode(JSON.stringify(response.result));
        dispatch(transactionActions.setTransactionData(bookingDataEncode));
        document.location.href = '/pay-done';
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      //show error toast
      message('error', error.message);
    }
  };

  const loadPaymentSDK = async () => {
    let bookingDataDecode = JSON.parse(decode(bookingDataEncode));

    let sdkTemplate = process.env.REACT_APP_URL_PAYMENT_TEMPLATE_DEV;
    let sdkLib = process.env.REACT_APP_URL_PAYMENT_LIB_DEV;
    let sdkCss = process.env.REACT_APP_URL_PAYMENT_CSS_DEV;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // sdkTemplate = process.env.REACT_APP_URL_PAYMENT_TEMPLATE_DEV;
      // sdkLib = process.env.REACT_APP_URL_PAYMENT_LIB_DEV;
      // sdkCss = process.env.REACT_APP_URL_PAYMENT_CSS_DEV;

      sdkTemplate = process.env.REACT_APP_URL_PAYMENT_TEMPLATE_PROD;
      sdkLib = process.env.REACT_APP_URL_PAYMENT_LIB_PROD;
      sdkCss = process.env.REACT_APP_URL_PAYMENT_CSS_PROD;
    } else {
      sdkTemplate = process.env.REACT_APP_URL_PAYMENT_TEMPLATE_PROD;
      sdkLib = process.env.REACT_APP_URL_PAYMENT_LIB_PROD;
      sdkCss = process.env.REACT_APP_URL_PAYMENT_CSS_PROD;
    }

    Promise.all([
      loadCss(sdkCss),
      loadScript(sdkTemplate),
      loadScript(sdkLib),
    ]).then(() => {
      const signature = sha512.create();
      signature.update(
        encode(
          bookingDataDecode.header.paymentMerchantKey +
            '//' +
            bookingDataDecode.header.bookingRef +
            '//' +
            bookingDataDecode.header.paymentTotal +
            '//' +
            'Apps2pay'
        )
      );
      signature.hex();

      new window.MKPPayment(
        {
          signature: signature,
          merchant_invoice_no: bookingDataDecode.header.bookingRef,
          product_description:
            'Pembayaran transaksi no ' + bookingDataDecode.header.bookingRef,
          product_amount: bookingDataDecode.header.paymentTotal,
          merchant_key: bookingDataDecode.header.paymentMerchantKey,
          selector: '#payment-area',
          redirect_url: `${window.location.protocol}//apipayment.mkpmobile.com/onlineticketing/bookingv2/callback/${bookingDataDecode.header.paymentMerchantKey}/${bookingDataDecode.header.bookingRef}`,
        },
        function () {
          //fungsi kosongan
        },
        function (data: any) {
          if (data.status === 200) {
            const mKey = bookingDataDecode.header.paymentMerchantKey;
            const bookingRef = bookingDataDecode.header.bookingRef;
            const paymentCategory = data.result.paymentCategory;
            confirmationPayment(mKey, bookingRef, paymentCategory);
            //pembayaran sukses
          } else if (data.status === 201) {
          } else if (data.status === 404) {
            //pembayaran cancel
            message('error', 'Pembayaran dibatalkan');
            document.location.href = '/history';
            removeScript(sdkTemplate);
            removeScript(sdkLib);
            removeCss(sdkCss);
          } else if (data.status === 500) {
            // pembayaran failed 500;
            message(
              'error',
              'Pembayaran gagal, silahkan lakukan pembelian ulang'
            );
            window.history.back();
            removeScript(sdkTemplate);
            removeScript(sdkLib);
            removeCss(sdkCss);
          }
        }
      );
    });
  };

  const loadCss = (url: any) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('link');
      script.setAttribute('rel', 'stylesheet');
      script.setAttribute('type', 'text/css');
      script.setAttribute('href', url);
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const removeCss = (scriptToremove: any) => {
    let allsuspects = document.getElementsByTagName('link');
    for (let i = allsuspects.length; i >= 0; i--) {
      if (
        allsuspects[i] &&
        allsuspects[i].getAttribute('href') !== null &&
        allsuspects[i].getAttribute('href')?.indexOf(`${scriptToremove}`) !== -1
      ) {
        allsuspects[i].parentNode?.removeChild(allsuspects[i]);
      }
    }
  };

  const loadScript = (url: any) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('async', 'true');
      script.setAttribute('src', url);
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const removeScript = (scriptToremove: any) => {
    let allsuspects = document.getElementsByTagName('script');
    for (let i = allsuspects.length; i >= 0; i--) {
      if (
        allsuspects[i] &&
        allsuspects[i].getAttribute('src') !== null &&
        allsuspects[i].getAttribute('src')?.indexOf(`${scriptToremove}`) !== -1
      ) {
        allsuspects[i].parentNode?.removeChild(allsuspects[i]);
      }
    }
  };

  const renderMain = () => {
    let bookingDataDecode: any = null;
    if (bookingDataEncode) {
      bookingDataDecode = JSON.parse(decode(bookingDataEncode));
    }
    let bookingDate: any = null;
    if (location.state?.data) {
      let res = JSON.parse(decode(location.state?.data));
      bookingDate = res?.bookingDate;
    }
    return (
      <div className="w-full flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2 p-2 md:p-6 lg:p-8">
        <div className="flex flex-row justify-between items-start">
          <p className="text-lg md:text-2xl font-semibold">Detail Pemesan</p>
          <div className="flex flex-col items-end">
            <p className="text-xs text-neutral-500">Tanggal Transaksi dibuat</p>
            <p className="text-sm font-normal mt-1">
              {bookingDataDecode?.header?.createdAt}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Tanggal Booking</p>
          <p className="text-sm sm:text-base md:text-lg font-medium mt-1">
            {moment(bookingDate).format('ll')}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Nama Pemesan</p>
          <p className="text-sm sm:text-base md:text-lg font-medium mt-1">
            {bookingDataDecode?.header?.customerName}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Email Pemesan</p>
          <p className="text-sm sm:text-base md:text-lg font-medium mt-1">
            {bookingDataDecode?.header?.customerEmail}
          </p>
        </div>
        <div className="border-b border-neutral-200 dark:border-neutral-700" />
        <p className="text-lg md:text-2xl font-semibold">Detail Pesanan</p>
        {Object.values(bookingData).map((data: any, index: number) => {
          return (
            <div key={index.toString()}>
              <p className="text-base font-medium">
                {index + 1}. {Object.keys(bookingData)[index]}
              </p>
              {data.map((item: any, index: number) => (
                <div
                  className="flex flex-row items-start justify-between"
                  key={index.toString()}
                >
                  <p className="text-neutral-6000 text-ellipsis">
                    {item.productName} x{item.productQty}
                  </p>
                  <p className="text-neutral-6000">
                    Rp. {convertNumbThousand(item.productPrice)}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
        <div className="border-b border-neutral-200 dark:border-neutral-700" />
        <p className="text-lg md:text-2xl font-semibold">Detail Pembayaran</p>
        <div className="flex flex-row items-start justify-between">
          <p className="text-neutral-6000">Subtotal pesanan</p>
          <p className="text-neutral-6000">
            Rp. {convertNumbThousand(bookingDataDecode?.header?.paymentTotal)}
          </p>
        </div>
        <div className="flex flex-row items-start justify-between">
          <p className="text-neutral-6000">Total Diskon pesanan</p>
          <p className="text-neutral-6000">
            Rp.{' '}
            {convertNumbThousand(bookingDataDecode?.header?.paymentDiscount)}
          </p>
        </div>
        <div className="flex flex-row items-start justify-between font-bold">
          <p className="text-neutral-6000">Total pembayaran</p>
          <p className="text-neutral-6000">
            Rp. {convertNumbThousand(bookingDataDecode?.header?.paymentTotal)}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-5">
          <p className="text-xs text-red-600">Batas waktu pembayaran 10 menit!</p>
          <p className="text-red-600 text-center">Pilih pembayaran dan tekan Lanjutkan Pembayaran</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-CheckOutPage ${className}`} data-nc-id="CheckOutPage">
      <Helmet>
        <title>{getTitleWebsite()} - Checkout</title>
      </Helmet>
      <main className="container mt-5 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-3/5 lg:pr-10 ">{renderMain()}</div>
        <div id="payment-area" className="mt-5 md:m-0 block flex-grow"></div>
      </main>
    </div>
  );
};

export default CheckOutPage;
