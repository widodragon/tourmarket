import CardHistory from 'components/CardHistory/CardHistory';
import DatePickerComponent from 'components/DatePickerComponent/DatePickerComponent';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { encode } from 'js-base64';
import { Modal } from 'react-responsive-modal';
import { useHistory } from 'react-router-dom';
import Lottie from 'lottie-react';
import { sha512 } from 'js-sha512';

import EmptyLottie from 'images/lottie/empty.json';
import styles from './History.module.css';
import { POST } from 'utils/apiHelper';
import { getStorage, getTitleWebsite } from 'utils/localStorage';
import { EMAIL } from 'contains/contants';
import { message } from 'utils/message';
import { HistoryDataType } from 'data/types';
import * as transactionActions from 'redux/actions/transaction';
import moment from 'moment';

export interface HistoryPageProps {
  className?: string;
}

interface PaginationType {
  draw?: number;
  limit?: number;
  offset?: number;
  filter?: boolean;
}
// const historyData = [1];
const HistoryPage: FC<HistoryPageProps> = ({ className = '' }) => {
  const dispatch: any = useDispatch();
  const router: any = useHistory();
  const [historyData, setHistoryData] = useState<HistoryDataType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>('');
  const [openDetail, setOpenDetail] = useState<boolean[]>([]);
  const [selectedDay, setSelectedDay] = useState<any>({
    from: null,
    to: null,
  });
  const [totalPages, setTotalPages] = useState<any>(0);
  const [offsetData, setOffsetData] = useState(0);

  useEffect(() => {
    getReportingListCustomer({ draw: 1 });

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
  }, []);

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

  const loadPaymentSDK = async (
    mKey: string,
    bookingRef: string,
    paymentTotal: number
  ) => {
    setShowModal(true);
    let bookingData = {
      paymentMerchantKey: mKey,
      bookingRef,
      paymentTotal,
    };

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
          bookingData.paymentMerchantKey +
            '//' +
            bookingData.bookingRef +
            '//' +
            bookingData.paymentTotal +
            '//' +
            'Apps2pay'
        )
      );
      signature.hex();

      new window.MKPPayment(
        {
          signature: signature,
          merchant_invoice_no: bookingData.bookingRef,
          product_description:
            'Pembayaran transaksi no ' + bookingData.bookingRef,
          product_amount: bookingData.paymentTotal,
          merchant_key: bookingData.paymentMerchantKey,
          selector: '#payment-area',
          redirect_url: `${window.location.host}/bookingv2/callback/${bookingData.paymentMerchantKey}/${bookingData.bookingRef}`,
        },
        function () {
          //fungsi kosongan
        },
        function (data: any) {
          if (data.status === 200) {
            const mKey = bookingData.paymentMerchantKey;
            const bookingRef = bookingData.bookingRef;
            const paymentCategory = data.result.paymentCategory;
            confirmationPayment(mKey, bookingRef, paymentCategory);
            //pembayaran sukses
          } else if (data.status === 201) {
          } else if (data.status === 404) {
            //pembayaran cancel
            setShowModal(false);
            message('error', 'Pembayaran dibatalkan');
            removeScript(sdkTemplate);
            removeScript(sdkLib);
            removeCss(sdkCss);
          } else if (data.status === 500) {
            setShowModal(false);
            // pembayaran failed 500;
            message(
              'error',
              'Pembayaran gagal, silahkan lakukan pembelian ulang'
            );
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

  const nextPage = () => {
    if (offsetData < totalPages - 1) {
      setOffsetData(offsetData + 1);
      getReportingListCustomer({
        draw: 0,
        limit: 5,
        offset: 5 * (offsetData + 1),
        filter: true,
      });
    }
  };

  const backPage = () => {
    if (offsetData > 0) {
      setOffsetData(offsetData - 1);
      getReportingListCustomer({
        draw: 0,
        limit: 5,
        offset: 5 * (offsetData - 1),
        filter: true,
      });
    }
  };

  const getReportingListCustomer = async ({
    draw = 1,
    limit = 5,
    offset = 0,
    filter = false,
  }: PaginationType) => {
    const fromDate = selectedDay.from;
    const toDate = selectedDay.to;
    let dateNow = new Date();
    let beforeDate = moment(dateNow).subtract(1, 'days');
    let formatFromDate = '';
    let formatToDate = '';

    if (fromDate !== undefined && fromDate !== null) {
      formatFromDate = `${fromDate.year
        .toString()
        .padStart(2, '0')}-${fromDate.month
        .toString()
        .padStart(2, '0')}-${fromDate.day.toString().padStart(2, '0')} 00:00`;
    }

    if (toDate !== undefined && toDate !== null) {
      formatToDate = `${toDate.year.toString().padStart(2, '0')}-${toDate.month
        .toString()
        .padStart(2, '0')}-${toDate.day.toString().padStart(2, '0')} 23:59`;
    }

    try {
      const customerEmail = getStorage(EMAIL);

      if (customerEmail) {
        let body: any = null;
        if (!filter) {
          body = {
            bookingRef: bookingRef,
            customerEmail: customerEmail,
            paymentStatus: selectedPaymentStatus,
            paymentMethod: '',
            dateFrom: beforeDate.format('YYYY-MM-DD') + ' 00:00:00',
            dateTo: moment(dateNow).format('YYYY-MM-DD') + ' 23:59:59',
            draw: draw,
            limit: limit,
            offset: offset,
          };
        } else {
          body = {
            bookingRef: bookingRef,
            customerEmail: customerEmail,
            paymentStatus:
              selectedPaymentStatus === 'Semua Transaksi'
                ? selectedPaymentStatus
                : '',
            paymentMethod: '',
            dateFrom: formatFromDate,
            dateTo: formatToDate,
            draw: draw,
            limit: limit,
            offset: offset,
          };
        }
        const response = await POST('/reporting/customers/listv2', body);

        if (response.success) {
          if (draw === 1) {
            setTotalPages(Math.ceil(response.result?.totalData / limit));
          }
          setHistoryData(response.result?.reportingList);
        } else {
          throw Error(response.message);
        }
      }
    } catch (error: any) {
      message('error', error.message);
    }
  };

  const handleChange = (data: any) => {
    setSelectedDay(data);
  };

  return (
    <>
      <div className={`nc-HistoryPage ${className}`} data-nc-id="HistoryPage">
        <Helmet>
          <title>{getTitleWebsite()} - History</title>
        </Helmet>
        <div className="container relative space-y-24 lg:space-y-32">
          <form
            className="listingSection__wrap py-1 w-11/12 mx-auto mt-10"
            onSubmit={(event) => {
              event.preventDefault();
              getReportingListCustomer({ draw: 1, filter: true, offset: 0 });
            }}
          >
            <div className="flex flex-col md:flex-row justify-around px-3 rounded-md my-4 mx-auto w-full">
              <div className="w-full my-1 md:w-96">
                <div className="input-group relative flex flex-row items-stretch w-full">
                  <input
                    type="search"
                    className="form-control relative flex-auto min-w-0 block w-full px-3 text-sm text-slate-300 bg-transparent bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-transparent focus:border-none focus:outline-none"
                    placeholder="Cari"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    aria-label="Search"
                    aria-describedby="button-addon2"
                  />
                </div>
              </div>
              <div className="w-full my-1 md:w-64">
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="form-select appearance-none
                                                block
                                                w-full
                                                px-3
                                                text-sm
                                                font-normal
                                                text-slate-300
                                                bg-transparent bg-clip-padding bg-no-repeat
                                                border border-solid border-gray-300
                                                rounded
                                                transition
                                                ease-in-out
                                                m-0
                                                focus:text-gray-700 focus:bg-transparent focus:border-none focus:outline-none"
                  aria-label="Default select example"
                >
                  <option selected>Semua Transaksi</option>
                  <option value="SUCCESS">Transaksi Sukses</option>
                  <option value="PENDING">Transaksi Pending</option>
                  <option value="FAILED">Transaksi Gagal</option>
                </select>
              </div>
              <div className="w-full my-1 md:w-64">
                <DatePickerComponent
                  value={selectedDay}
                  onChange={(data: any) => handleChange(data)}
                  inputPicker={styles.inputPicker}
                />
                {/* <input type="text"
                                className="form-control block w-full px-3 text-sm font-normal text-gray-700 bg-transparent bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="Select a date" /> */}
              </div>
              <button
                type="submit"
                className="my-1 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Filter
              </button>
            </div>
          </form>
          <div style={{ marginTop: '25px' }}>
            {historyData?.map((item: HistoryDataType, index: number) => (
              <CardHistory
                key={index}
                openDetail={openDetail[index]}
                handleDetail={() => {
                  openDetail[index] = !openDetail[index];
                  setOpenDetail([...openDetail]);
                }}
                data={item}
                onConfirmation={() =>
                  loadPaymentSDK(
                    item.paymentMerchantKey,
                    item.bookingRef,
                    item.paymentTotal
                  )
                }
              />
            ))}
          </div>
        </div>
        {historyData?.length === 0 && (
          <div className="mt-25 py-1 w-11/12 mx-auto flex flex-col items-center">
            <Lottie
              animationData={EmptyLottie}
              rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
              className="w-100"
            />
            <p className="text-gray-600 text-lg">
              Riwayat transaksi tidak ditemukan
            </p>
          </div>
        )}
        {historyData?.length > 0 && (
          <div className="scrollbar-hide overflow-x-scroll mx-8 md:mx-36 lg:mx-24 xl:mx-36 mt-2 mb-10 lg:mb-20">
            {/* <Pagination /> */}
            <div className="flex flex-row w-full justify-center items-center mt-5">
              <i
                onClick={() => backPage()}
                className="la la-arrow-alt-circle-left text-4xl cursor-pointer"
                aria-hidden="true"
              ></i>
              <span className="text-xl mx-5">{offsetData + 1}</span>
              <i
                onClick={() => nextPage()}
                className="la la-arrow-alt-circle-right text-4xl cursor-pointer"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        )}
      </div>
      {/* Start: Loading checkout Dialog */}
      <Modal
        modalId={'payment-area'}
        open={showModal}
        onClose={() => {}}
        closeIcon={<></>}
        center
        blockScroll
        classNames={{
          modal: 'rounded-lg w-[93vw] h-[90vh] sm:h-[85vh] md:h-[80vh]',
        }}
      ></Modal>
      {/* End: Loading checkout Dialog */}
    </>
  );
};

export default HistoryPage;
