import React, { FC, useEffect, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import {
  DetailHistoryDataType,
  HistoryDataType,
  ReportingDetailDataType,
} from 'data/types';
import convertNumbThousand from 'utils/convertNumbThousand';
import { message } from 'utils/message';
import { POST } from 'utils/apiHelper';
import QrCode from 'components/QrCode/QrCode';

export interface CardHistoryProps {
  openDetail?: boolean;
  handleDetail?: any;
  data: HistoryDataType;
  onConfirmation: VoidFunction;
}

const CardHistory: FC<CardHistoryProps> = ({
  openDetail = false,
  handleDetail,
  data,
  onConfirmation,
}) => {
  const [historyDetail, setHistoryDetail] = useState<DetailHistoryDataType>();
  const [ticketList, setTicketList] = useState<any[]>();
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>();

  useEffect(() => {
    if (openDetail) {
      getReportingDetailCustomer();
    }
  }, [openDetail]);

  const handleOpen = (qrCode: string) => {
    setShowQR(true);
    setQRCode(qrCode);
  };

  const handleClose = () => {
    setShowQR(false);
  };

  const getReportingDetailCustomer = async () => {
    try {
      const body = {
        bookingRef: data.bookingRef,
      };

      const response = await POST('/reporting/customers/detail', body);
      if (response.success) {
        setHistoryDetail(response.result);
        if (response.result.paymentStatus === 'SUCCESS') {
          getTicketListByBindingCode(
            response.result.reportingTcs[0].bindingCode
          );
        }
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      message('error', error.message);
    }
  };

  const getTicketListByBindingCode = async (bindingCode: string) => {
    console.log(bindingCode);
    try {
      const body = {
        coreTicketingRef: bindingCode,
        replaceAlloc: true,
        publishRedis: false,
      };

      const response = await POST('/reporting/ticketcore/list', body);
      if (response.success) {
        setTicketList(response.result);
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      message('error', error.message);
    }
  };

  return (
    <>
      <div className="py-1 w-11/12 mx-auto">
        <div className="flex flex-col rounded-md my-4 mx-auto md:w-full">
          <div className="listingSection__wrap flex flex-col px-3 md:p-6 rounded-lg shadow-lg md:w-full">
            <p className="text-gray-600 font-bold text-sm md:text-lg block md:hidden">
              {data.bookingRef}
            </p>
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div className="flex flex-col justify-between">
                <p className="text-gray-600 font-bold text-sm md:text-lg hidden md:block">
                  {data.bookingRef}
                </p>
                <p className="text-black text-xs md:text-base sm:mt-2">
                  Total Rp {convertNumbThousand(data.paymentTotal)}
                </p>
                {/* <button type="button" className="my-1 hidden mt-3 font-bold rounded-xl md:inline-block w-40 capitalize py-2.5 bg-blue-600 text-white text-xs md:text-sm leading-tight shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Konfirmasi Booking</button> */}
              </div>
              <div className="flex flex-col justify-between items-start md:items-end">
                <p className="text-gray-600 text-xs md:text-base">
                  {data.paymentDate}
                </p>
                <p
                  className={`${
                    data.paymentStatus === 'PENDING'
                      ? 'text-yellow-400'
                      : data.paymentStatus === 'SUCCESS'
                      ? 'text-green-400'
                      : 'text-red-400'
                  } font-bold text-xs md:text-base mt-2 uppercase`}
                >
                  {data.paymentStatus === 'PENDING'
                    ? 'TERTUNDA'
                    : data.paymentStatus === 'SUCCESS'
                    ? 'SUKSES'
                    : 'GAGAL'}
                </p>
                {data.paymentStatus === 'PENDING' && (
                  <button
                    type="button"
                    onClick={onConfirmation}
                    className="self-start md:self-end mt-2 font-bold rounded-xl w-full h-8 sm:h-10 sm:w-52 capitalize p-1.5 bg-yellow-400 text-white text-xs md:text-sm leading-tight shadow-md hover:bg-yellow-300 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Konfirmasi Pembayaran
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDetail()}
              className="flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium text-blue-400 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
            >
              <span>Detail</span>
              <ChevronUpIcon
                className={`${
                  openDetail ? 'rotate-180 transform' : ''
                } h-5 w-5 text-blue-400`}
              />
            </button>
            {openDetail ? (
              <div className="w-full mx-auto pt-4 pb-2 text-sm text-gray-500">
                <p className="text-blue-500 font-bold text-lg md:text-xl mb-6">
                  Rincian Pesanan
                </p>
                <div className="flex md:flex-row justify-between items-center">
                  <div className="flex flex-col justify-between">
                    <p className="text-gray-600 font-bold block text-xs md:text-lg">
                      {historyDetail?.reportingTcs[0].tcName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-full">
                  {historyDetail?.reportingTcs[0].reportingDetail.map(
                    (item: ReportingDetailDataType, index) => (
                      <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-gray-600 md:font-normal text-xs md:text-base mt-2">
                          {item.productName} x{item.productQty}
                        </p>
                        <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                          Rp.{convertNumbThousand(item.productPrice)}
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-row justify-between items-start md:items-center w-full">
                  <p className="text-gray-600 md:font-normal text-xs md:text-base mt-2">
                    Waktu Berlaku
                  </p>
                  <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                    {historyDetail?.reportingTcs[0].bookingDate}
                  </p>
                </div>
                {/* ------------------------------ */}
                <p className="text-blue-500 font-bold text-lg md:text-xl mb-6 mt-6">
                  Detail Pembayaran
                </p>
                <div className="flex flex-row justify-between md:items-center w-full">
                  <p className="text-gray-600 text-xs md:text-base mt-2">
                    Tanggal Transaksi
                  </p>
                  <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                    {historyDetail?.paymentDate}
                  </p>
                </div>
                <div className="flex flex-row justify-between md:items-center w-full">
                  <p className="text-gray-600 text-xs md:text-base mt-2">
                    No Transaksi
                  </p>
                  <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                    {historyDetail?.bookingRef}
                  </p>
                </div>
                <div className="flex flex-row justify-between md:items-center w-full">
                  <p className="text-gray-600 text-xs md:text-base mt-2">
                    Total Pembayaran
                  </p>
                  <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                    Rp {convertNumbThousand(historyDetail?.paymentTotal)}
                  </p>
                </div>
                <div className="flex flex-row justify-between md:items-center w-full">
                  <p className="text-gray-600 text-xs md:text-base mt-2">
                    Metode Pembayaran
                  </p>
                  <p className="text-gray-600 font-medium text-xs md:text-base mt-2">
                    {historyDetail?.paymentMethod}
                  </p>
                </div>
                {/* ------------------------------ */}
                {historyDetail?.paymentStatus === 'SUCCESS' && (
                  <p className="text-blue-500 font-bold text-lg md:text-xl mb-6 mt-6">
                    Detail Tiket
                  </p>
                )}
                <div className="flex flex-col items-start w-full">
                  {ticketList?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-row items-center justify-between w-full"
                    >
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-gray-600 text-xs md:text-base mt-2">
                          {item.bulkTicket[0].visitorName}
                        </p>
                        {item.bulkTicket.map((item: any, index: number) => (
                          <li
                            key={index}
                            className="text-gray-600 text-xs md:text-base mt-2"
                          >
                            {item.productName}
                          </li>
                        ))}
                      </div>
                      <div className="flex-col justify-between items-start md:items-end">
                        <div className="">
                          <button
                            type="button"
                            onClick={() => handleOpen(item.qrCode)}
                            className="my-1 mt-3 
                            font-bold 
                            rounded-xl inline-block w-20 
                            md:w-40 capitalize py-2.5 bg-blue-600 
                            text-white text-xs md:text-sm leading-tight shadow-md 
                            hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
                            focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 
                            active:shadow-lg transition duration-150 ease-in-out"
                          >
                            QR CODE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Transition appear show={showQR} as={React.Fragment}>
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
                <Dialog.Panel className="w-full h-96 max-h-fit max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-center text-gray-900"
                  >
                    QR CODE
                  </Dialog.Title>
                  <div className="mt-5">
                    <QrCode qrValue={qrCode ?? ''} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CardHistory;
