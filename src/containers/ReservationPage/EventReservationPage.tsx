import React, { FC, useState } from 'react';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import Lottie from 'lottie-react';
import { useHistory, useLocation } from 'react-router-dom';
import { decode, encode } from 'js-base64';
import { Modal } from 'react-responsive-modal';
import moment from 'moment';
import 'moment/locale/id';
import 'react-responsive-modal/styles.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { POST } from 'utils/apiHelper';
import ImageGallery from 'react-image-gallery';
import styles from './Reservation.module.css';
import convertNumbThousand from 'utils/convertNumbThousand';
import { message } from 'utils/message';
import { Dialog, Transition } from '@headlessui/react';
import { deleteRequestInquiry, getTitleWebsite, getUserStorage } from 'utils/localStorage';
import MobileReserveSticky from './MobileReserveSticky';
import LoadingLottie from 'images/lottie/loading.json';
import { Helmet } from 'react-helmet';
import { shortString } from 'utils/shortString';

export interface EventReservationPageProps {
  className?: string;
}

export interface ProductSelectedType {
  indexProduct?: number;
  value?: number;
}

export interface ProductSelectedProps {
  passenger?: number;
  productSelected?: ProductSelectedType[];
}

const EventReservationPage: FC<EventReservationPageProps> = ({
  className = '',
}) => {
  const location: any = useLocation();
  const router: any = useHistory();
  const [passangerSchema, setPassangerSchema] = useState<any>(null);
  const [defaultValuePassanger, setDefaultValuePassanger] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [countPerson, setCountPerson] = useState<any>([]);
  const [productTcs, setProductTcs] = useState<any>([]);
  const [productSelected, setProductSelected] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showAPILoading, setShowAPILoading] = useState<boolean>(false);
  const [passengerForm, setPassengerForm] = useState(null);

  React.useEffect(() => {
    if (productTcs.length === 0 && productSelected.length !== 0) {
      getProductTcsInformation();
    }
  }, [productTcs, productSelected]);

  const handleClose = () => {
    setOpenModal(false);
    setPassengerForm(null);
  };

  const handleClickDecrement = (passanger: any, indexProduct: number) => {
    setRefresh(true);
    let productTemp: any = [...productSelected];
    let isSame = productTemp.filter(
      (item: any) => item.passenger === passanger
    );
    if (isSame.length > 0) {
      isSame.map(async (res: any) => {
        let productCount = [...res.productSelected];
        let isSameProductCount = productCount.filter(
          (item: any) => item.indexProduct === indexProduct
        );
        if (isSameProductCount.length > 0) {
          if (isSameProductCount[0].value > 0) {
            let newCount = {};
            let totalPrice =
              (isSameProductCount[0].value - 1) *
              isSameProductCount[0].item?.b2cPrice;
            newCount = {
              indexProduct: isSameProductCount[0].indexProduct,
              value: isSameProductCount[0].value - 1,
              item: isSameProductCount[0].item,
              total: totalPrice,
            };
            productCount[indexProduct] = newCount;
            productTemp[passanger] = {
              passenger: passanger,
              productSelected: productCount,
            };
            setProductSelected(productTemp);
            setRefresh(false);
          }
        }
      });
    }
  };

  const handleClickIncrement = async (passanger: any, indexProduct: number) => {
    setRefresh(true);
    let productTemp: any = [...productSelected];
    let isSame = productTemp.filter(
      (item: any) => item.passenger === passanger
    );
    if (isSame.length > 0) {
      isSame.map(async (res: any) => {
        let productCount = [...res.productSelected];
        let isSameProductCount = productCount.filter(
          (item: any) => item.indexProduct === indexProduct
        );
        if (isSameProductCount.length > 0) {
          if (isSameProductCount[0].value <= 3) {
            let newCount = {};
            let totalPrice =
              (isSameProductCount[0].value + 1) *
              isSameProductCount[0].item?.b2cPrice;
            newCount = {
              indexProduct: isSameProductCount[0].indexProduct,
              value: isSameProductCount[0].value + 1,
              item: isSameProductCount[0].item,
              total: totalPrice,
            };
            productCount[indexProduct] = newCount;
            productTemp[passanger] = {
              passenger: passanger,
              productSelected: productCount,
            };
            setProductSelected(productTemp);
            setRefresh(false);
          }
        }
      });
    }
  };

  const getProductTcsInformation = async () => {
    let key = location.state && location.state.data;
    if (key) {
      let decodeToJson = JSON.parse(decode(key));
      let body = {
        eventDetailCode: decodeToJson?.eventDetailCode,
        eventStartDate: decodeToJson?.eventStartDate,
        eventEndDate: decodeToJson?.eventEndDate,
      };
      POST('/mevent-tcsdetailproduct/list/index', body)
        .then((tcs) => {
          if (Object.keys(tcs.result).length > 0) {
            let listProduct: any = [];
            tcs.result?.listProduct.map((item: any) => {
              let image: any = [];
              let productConfig = {};
              if (item.productConfig?.imageGallery?.length !== 0) {
                item.productConfig.imageGallery?.map((res: any) => {
                  image.push({
                    original: res,
                    thumbnail: res,
                  });
                });
              }
              productConfig = {
                ...item,
                imageGallery: image,
              };
              listProduct.push({
                ...item,
                productConfig: productConfig,
              });
            });

            let countClickArr: any = [];
            let productTemp = productSelected;
            listProduct?.map((item: any, index: number) => {
              productSelected?.map(async (res: any, i: any) => {
                if (!countClickArr[index]) {
                  countClickArr.push({
                    indexProduct: index,
                    value: 0,
                    item: item,
                    total: 0,
                  });
                }
                productTemp[i] = {
                  passenger: i,
                  productSelected: countClickArr,
                };
                setProductSelected(productTemp);
              });
            });
            setProductTcs(listProduct);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleToPayment = async () => {
    let key = location.state && location.state.data;
    let bookingDate = '';
    let user = getUserStorage();

    if (key) {
      let decodeToJson = JSON.parse(decode(key));
      bookingDate = decodeToJson.eventStartDate;
      let visitorList: any = [];
      let bookingList: any = [];
      countPerson?.map((res: any) => {
        productSelected?.map((item: any) => {
          item?.productSelected?.map((count: any) => {
            if (item.passenger === res) {
              if (count.value > 0) {
                bookingList.push({
                  passenger: item.passenger,
                  item: {
                    productPrice: count?.item?.b2cPrice,
                    productVendorCode: count?.item?.productVendorCode,
                    productQty: count.value,
                    productFee: count?.item?.serviceFee,
                    productCode: count?.item?.productCode,
                    productName: count?.item?.productName,
                    uniqueProductCode: count?.item?.uniqueProductCode,
                  },
                });
              }
            }
          });
        });
        let booking: any = [];
        bookingList?.map((book: any) => {
          if (book.passenger === res) {
            booking.push(book.item);
          }
        });
        visitorList.push({
          visitorName: passengerForm?.[`name_${res}`],
          visitorIdType: passengerForm?.[`identity_${res}`],
          visitorId: passengerForm?.[`identityNumber_${res}`],
          visitorPhone: JSON.stringify(passengerForm?.[`phone_${res}`]),
          visitorEmail: passengerForm?.[`email_${res}`],
          visitorGender: passengerForm?.[`gender_${res}`],
          bookingList: booking,
        });
      });
      let getTotalPrice = 0;
      productSelected?.map((item: any) => {
        item?.productSelected?.map((res: any) => {
          getTotalPrice += res?.total;
        });
      });
      let body = {
        header: {
          customerCID: user?.cid,
          customerHirarki: user?.hirarki,
          customerName: user?.name,
          customerEmail: user?.email,
          customerPhone: user?.phone,
          merchantKey: decodeToJson.merchantKey,
          paymentTotal: getTotalPrice,
        },
        detail: [
          {
            tcCID: decodeToJson.cid,
            tcVendorCode: decodeToJson.tcVendorCode,
            tcName: decodeToJson.name,
            tcHirarki: decodeToJson.hirarki,
            bookingDateStart: decodeToJson.eventStartDate,
            bookingDateEnd: decodeToJson.eventEndDate,
            visitorList: visitorList,
          },
        ],
      };

      inquiry(body, bookingDate);
    }
  };

  const inquiry = async (body: any, bookingDate: string) => {
    // close confirmation dialog
    handleClose();
    // show loading dialog
    setShowAPILoading(true);
    deleteRequestInquiry();
    setTimeout(() => {
      router.push('/checkout', {
        data: encode(JSON.stringify({
          body: body,
          bookingDate: bookingDate
        })),
      });
      setShowAPILoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (!defaultValuePassanger && !passangerSchema) {
      setLoading(true);
      let objectTemp = {};
      let defaultValueTemp = {};
      let key = location.state && location.state.data;
      if (key) {
        let decodeToJson = JSON.parse(decode(key));
        if (decodeToJson) {
          let totalPassanger = decodeToJson.person;
          let personTemp = [];
          for (let i = 0; i < totalPassanger; i++) {
            personTemp.push(i);
          }
          setCountPerson(personTemp);
          let productSelectTemp = [];
          for (let i = 0; i < totalPassanger; i++) {
            productSelectTemp.push({
              passenger: i,
              productSelected: [],
            });
            objectTemp = {
              ...objectTemp,
              [`email_${i}`]: Yup.string()
                .email('Invalid email'),
              [`identity_${i}`]: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!'),
              [`gender_${i}`]: Yup.string(),
              [`name_${i}`]: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('Required'),
              [`identityNumber_${i}`]: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!'),
              [`phone_${i}`]: Yup.number(),
            };

            defaultValueTemp = {
              ...defaultValueTemp,
              [`email_${i}`]: '',
              [`identity_${i}`]: '',
              [`gender_${i}`]: '',
              [`name_${i}`]: '',
              [`identityNumber_${i}`]: '',
              [`phone_${i}`]: '',
            };
          }

          objectTemp = {
            ...objectTemp,
          };

          defaultValueTemp = {
            ...defaultValueTemp,
            customerName: '',
            telephone: '',
            email: '',
          };
          setProductSelected(productSelectTemp);
          setPassangerSchema(objectTemp);
          setDefaultValuePassanger(defaultValueTemp);
          setLoading(false);
        }
      }
    }
  }, [defaultValuePassanger, passangerSchema]);

  const renderSidebar = (values: any) => {
    let key = location.state && location.state.data;
    let bookingDate = '';
    if (key) {
      let decodeToJson = JSON.parse(decode(key));
      bookingDate = decodeToJson.eventStartDate;
    }

    let getTotalPrice = 0;
    let getTotalServicePrice = 0;
    productSelected?.map((item: any) => {
      item?.productSelected?.map((res: any) => {
        getTotalPrice += res?.total;
        getTotalServicePrice += res?.item?.serviceFee;
      });
    });
    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Detail pesanan</h3>
          <div className="flex flex-row items-center justify-between">
            <p>Tanggal booking</p>
            <p>{moment(bookingDate).format('ll')}</p>
          </div>
          {productSelected?.map((item: any, index: any) => {
            return (
              <>
                <h3 className="text-xl font-semibold">
                  Pengunjung {index + 1}
                </h3>
                {item?.productSelected?.map((res: any) => {
                  if (res.value > 0) {
                    return (
                      <>
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>
                            {res?.item?.productName} x {res?.value}
                          </span>
                          <span>
                            Rp{' '}
                            {convertNumbThousand(
                              res?.value * res?.item?.b2cPrice
                            )}
                          </span>
                        </div>
                      </>
                    );
                  }
                })}
                {/* <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>KTM 10K x 1</span>
                    <span>Rp 10.000</span>
                  </div> */}
              </>
            );
          })}
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {convertNumbThousand(getTotalPrice)}</span>
          </div>
        </div>
        <ButtonPrimary type="submit">Reserve</ButtonPrimary>
      </div>
    );
  };

  const renderMain = (
    value: number,
    errors: any,
    touched: any,
    setFieldValue: any
  ) => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8 mb-5">
        <h2 className="text-2xl lg:text-3xl font-semibold">
          Pengunjung ke-{value + 1}
        </h2>
        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
        <main className="container relative z-10 flex flex-col lg:flex-row ">
          {/* CONTENT */}
          <div className="w-full mb-8">
            <div className="flex flex-col w-full mb-2">
              <span className="text-neutral-800 dark:text-neutral-200 text-base">
                Name
              </span>
              <Field
                type="text"
                placeholder="Name"
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
                name={`name_${value}`}
              />
              {errors[`name_${value}`] && touched[`name_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`name_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col w-full mb-2">
              <span className="text-neutral-800 dark:text-neutral-200">
                Jenis Identitas
              </span>
              <Field
                as="select"
                placeholder="Pilih Jenis Identitas"
                name={`identity_${value}`}
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
              >
                <option value="ktp">KTP</option>
                <option value="sim">SIM</option>
                <option value="passport">Passport</option>
              </Field>
              {errors[`identity_${value}`] && touched[`identity_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`identity_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col w-full">
              <span className="text-neutral-800 dark:text-neutral-200 text-base">
                Nomor Identitas
              </span>
              <Field
                type="text"
                placeholder="Nomor identitas"
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
                name={`identityNumber_${value}`}
              />
              {errors[`identityNumber_${value}`] &&
                touched[`identityNumber_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`identityNumber_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
            <div className="border-b border-neutral-200 dark:border-neutral-700 mt-8 mb-5"></div>
            <div className="flex flex-col w-full mb-2">
              <span className="text-neutral-800 dark:text-neutral-200 text-base">
                Telephone
              </span>
              <Field
                type="number"
                placeholder="Telephone"
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
                name={`phone_${value}`}
              />
              {errors[`phone_${value}`] && touched[`phone_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`phone_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col w-full mb-2">
              <span className="text-neutral-800 dark:text-neutral-200 text-base">
                Alamat E-mail
              </span>
              <Field
                type="email"
                placeholder="Nama email"
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
                name={`email_${value}`}
              />
              {errors[`email_${value}`] && touched[`email_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`email_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col w-full">
              <span className="text-neutral-800 dark:text-neutral-200">
                Gender
              </span>
              <Field
                as="select"
                name={`gender_${value}`}
                className="rounded-md focus:outline-none border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 mt-1.5 bg-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
              {errors[`gender_${value}`] && touched[`gender_${value}`] ? (
                <div className="text-sm text-red-500 mt-2">
                  {errors[`gender_${value}`]?.toString()}
                </div>
              ) : null}
            </div>
          </div>
        </main>
        <div className="border-b border-neutral-200 dark:border-neutral-700 mt-1 mb-5"></div>
        <h2 className="text-xl lg:text-2xl font-semibold">Product</h2>
        <div className="border-b border-neutral-200 dark:border-neutral-700 mt-5 mb-5"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {productTcs?.map((item: any, index: number) => {
            return (
              <div className="m-2 flex flex-col" key={index}>
                <ImageGallery
                  items={item.productConfig?.imageGallery}
                  // autoPlay={true}
                  showBullets={true}
                  showThumbnails={false}
                  showPlayButton={false}
                  showNav={false}
                  additionalClass={styles.imageGallery}
                />
                <div className="w-full h-16 flex flex-row bg-slate-500 py-2 justify-center items-center">
                  <span className="text-white">
                    {shortString(item?.productName, 70)} - Rp{' '}
                    {convertNumbThousand(item?.b2cPrice)}
                  </span>
                </div>
                <div className="flex flex-row w-full justify-center mt-2">
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full bg-gray-300 mr-5"
                    onClick={() => handleClickDecrement(value, index)}
                  >
                    -
                  </button>
                  <span className="mr-5">
                    {productSelected[value]?.productSelected[index]?.value || 0}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full bg-gray-300"
                    onClick={() => handleClickIncrement(value, index)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFormik = () => {
    let key = location.state && location.state.data;
    let bookingDate = '';
    if (key) {
      let decodeToJson = JSON.parse(decode(key));
      bookingDate = decodeToJson.date;
    }

    return (
      <Formik
        initialValues={{
          ...defaultValuePassanger,
        }}
        validationSchema={Yup.object().shape(passangerSchema)}
        onSubmit={(values) => {
          let getCountItem: any = [];
          let getCheckPassanger: any = -1;
          productSelected?.map((item: any) => {
            item?.productSelected?.map((res: any) => {
              if (res.value > 0) {
                getCheckPassanger = item.passenger;
              }
            });
            if (getCheckPassanger !== -1) {
              let checkIsSame = false;
              getCountItem?.map((item: any) => {
                if (item.passenger === getCheckPassanger) {
                  checkIsSame = true;
                }
              });
              if (!checkIsSame) {
                getCountItem.push({
                  passenger: getCheckPassanger,
                });
              }
            }
          });
          countPerson?.map((item: string) => {
            getCountItem?.map((res: any) => {
              if (res.passenger === item) {
              }
            });
          });
          if (getCountItem.length !== countPerson.length) {
            message('error', 'Anda belum memilih produk!');
          } else {
            setOpenModal(true);
            setPassengerForm(values);
          }
        }}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <Form className="grid grid-cols-1 gap-6">
              <main className="container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row">
                <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10">
                  {countPerson.map((item: number, index: number) => (
                    <div key={index}>
                      {renderMain(item, errors, touched, setFieldValue)}
                    </div>
                  ))}
                </div>
                <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
                  <div className="sticky top-32">{renderSidebar(values)}</div>
                </div>
              </main>
              <MobileReserveSticky
                productSelected={productSelected}
                bookingDate={moment(bookingDate).format('ll')}
              />
            </Form>
          );
        }}
      </Formik>
    );
  };

  if (loading) {
    return null;
  } else {
    return (
      <div
        className={`nc-EventReservationPage ${className}`}
        data-nc-id="EventReservationPage"
      >
        <Helmet>
          <title>{getTitleWebsite()} - Reservation</title>
        </Helmet>
        {passangerSchema && defaultValuePassanger ? renderFormik() : null}

        {/* Start: Confirm checkout Dialog */}
        <Transition appear show={openModal} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleClose}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-center text-gray-900"
                    >
                      KONFIRMASI PESANAN
                    </Dialog.Title>
                    <div className="mt-10">
                      <Dialog.Title
                        as="p"
                        className="text-lg font-medium leading-6 text-left text-gray-900"
                      >
                        Apakah anda sudah yakin dengan pesanan anda?
                      </Dialog.Title>
                      <div className="flex flex-row justify-end items-center mt-5">
                        <ButtonPrimary
                          onClick={() => handleClose()}
                          type="button"
                          className="mr-2"
                        >
                          Batal
                        </ButtonPrimary>
                        <ButtonPrimary
                          onClick={() => handleToPayment()}
                          type="button"
                        >
                          Konfirmasi
                        </ButtonPrimary>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        {/* End: Confirm checkout Dialog */}

        {/* Start: Loading checkout Dialog */}
        <Modal
          open={showAPILoading}
          onClose={() => { }}
          closeIcon={<></>}
          center
          classNames={{
            modal: 'rounded-lg',
          }}
        >
          <div className="text-lg font-medium leading-6 text-center text-gray-900">
            <Lottie
              animationData={LoadingLottie}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid meet',
              }}
              className="w-100"
            />
            <p className="text-gray-600 text-lg">
              Sedang memproses pesanan anda, mohon tunggu ....
            </p>
          </div>
        </Modal>
        {/* End: Loading checkout Dialog */}
      </div>
    );
  }
};

export default EventReservationPage;
