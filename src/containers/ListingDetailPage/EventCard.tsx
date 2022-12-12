import moment from "moment";
import React, { FC, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { shortString } from "utils/shortString";
import { Dialog, Transition } from '@headlessui/react';
import { message } from "utils/message";
import { POST } from "utils/apiHelper";
import { encode } from "js-base64";
import { useHistory } from "react-router-dom";

export interface EventCardProps {
  className?: string;
  data?: any;
}

const EventCard: FC<EventCardProps> = ({ className = "", data }) => {
  const router: any = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [person, setPerson] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [disableBtn, setDisableBtn] = React.useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleDecrement = () => {
    if (person > 0) {
      setPerson(person - 1);
    }
  }

  const handleIncrement = () => {
    if (person < 10) {
      setPerson(person + 1);
    }
  }

  const handleToCheckout = () => {
    setDisableBtn(true);
    if (person === 0) {
      message('error', 'Please fill field correctly');
      setTimeout(()=>{
        setDisableBtn(false);
      }, 5000);
    } else {
        setLoading(true)
        let body = {
          cid: data?.item?.cid
        }
        POST("/mtcs/index", body).then((tcs) => {
          if (tcs.result) {
            let tcsProduct = tcs.result;
            let body = {
              eventStartDate: data?.schedule?.eventStartDate,
              eventEndDate: data?.schedule?.eventEndDate,
              eventDetailCode: data?.item?.eventDetailCode,
              person: person,
              cid: tcsProduct?.cid,
              merchantKey: tcsProduct?.merchantKey,
              name: data?.item?.eventDetailName,
              tcVendorCode: tcsProduct?.tcVendorCode,
              hirarki: tcsProduct?.hirarki,
            };
            let dataToEncode = encode(JSON.stringify(body));
            router.push('/event-reservation', {
              data: dataToEncode,
            });
            setLoading(false);
          }
        }).catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const renderDetailTop = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row ">
          <div className="w-24 md:w-20 lg:w-24 flex-shrink-0 md:pt-7">
            <img src={data?.item?.imageThumbnail} className="w-20 h-20 rounded-full object-contain" alt="" />
          </div>
          <div className="flex my-5 md:my-0">
            <div className="flex-shrink-0 flex flex-col items-center -py-2">
              <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
              <span className="block flex-grow border-l border-neutral-400 border-dashed my-1"></span>
              <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
            </div>
            <div className="ml-4 text-sm">
              <div className="flex flex-col mt-0">
                <span className=" text-neutral-500 dark:text-neutral-400">
                  {moment(data?.schedule?.eventStartDate).format("dddd, DD MMM . hh:mm a")}
                </span>
              </div>
              <div className="flex flex-col mt-20">
                <span className=" text-neutral-500 dark:text-neutral-400">
                  {moment(data?.schedule?.eventEndDate).format("dddd, DD MMM . hh:mm a")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!isOpen) return null;
    return (
      <div className="p-4 md:p-8 border border-neutral-200 dark:border-neutral-700 rounded-2xl ">
        {renderDetailTop()}
        <div className="my-7 md:my-10 space-y-5 md:pl-24">
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
          <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
            {data?.item?.eventDetailDescription}
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-EventCardgroup p-4 sm:p-6 relative bg-white dark:bg-neutral-900 border border-neutral-100
     dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow space-y-6 ${className}`}
      data-nc-id="EventCard"
    >
      <div
        className={` sm:pr-20 relative  ${className}`}
        data-nc-id="EventCard"
      >
        {/*  eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a href="##" className="absolute inset-0" />

        <span
          className={`absolute right-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center cursor-pointer ${isOpen ? "transform -rotate-180" : ""
            }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="text-xl las la-angle-down"></i>
        </span>

        <div className="flex  flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0">
          {/* LOGO IMG */}
          <div className="w-24 lg:w-32 flex-shrink-0">
            <img src={data?.item?.imageThumbnail} className="w-20 h-20 rounded-full object-contain" alt="" />
          </div>

          {/* FOR MOBILE RESPONSIVE */}
          <div className="block lg:hidden space-y-1">
            <div className="block flex-[4]">
              <div className="font-medium text-lg">
                {data?.item?.eventDetailName}
              </div>
              <div className="text-sm text-neutral-500 font-normal mt-0.5">{moment(data?.schedule?.eventStartDate).format("DD MMM . hh:mm a")} - {moment(data?.schedule?.eventEndDate).format("DD MMM . hh:mm a")}</div>
              {/* <div className="text-sm text-neutral-500 font-normal mt-0.5">
                {shortString(data?.item?.eventDetailDescription, 80)}
              </div> */}
            </div>
          </div>

          {/* TIME - NAME */}

          {/* TIMME */}

          {/* TYPE */}
          <div className="hidden lg:block flex-[4] whitespace-nowrap">
            <div className="font-medium text-lg">
              {data?.item?.eventDetailName}
            </div>
            <div className="text-sm text-neutral-500 font-normal mt-0.5">{moment(data?.schedule?.eventStartDate).format("DD MMM . hh:mm a")} - {moment(data?.schedule?.eventEndDate).format("DD MMM . hh:mm a")}</div>
            {/* <div className="text-sm text-neutral-500 font-normal mt-0.5">
              {shortString(data?.item?.eventDetailDescription, 80)}
            </div> */}
          </div>

          {/* PRICE */}
          <div className="flex-[4] whitespace-nowrap sm:text-right">
            <div>
              <span className="text-xl font-semibold text-secondary-6000">
                {/* {data.price} */}
              </span>
            </div>
            <ButtonPrimary onClick={() => setOpenModal(true)}>Pesan Tiket</ButtonPrimary>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      {renderDetail()}
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
                    PILIH JUMLAH PENGUNJUNG
                  </Dialog.Title>
                  <div className="mt-10 flex flex-col w-full justify-center items-center">
                    <div className="flex flex-row w-[50%] justify-between items-center align">
                      <button onClick={() => handleDecrement()} className="flex flex-row w-10 h-10 rounded-full bg-blue-300 justify-center items-center">-</button>
                      <span>{person}</span>
                      <button onClick={() => handleIncrement()} className="flex flex-row w-10 h-10 rounded-full bg-blue-300 justify-center items-center">+</button>
                    </div>
                    <div className="flex flex-row justify-end items-center mt-10 w-full">
                      <ButtonPrimary
                        onClick={() => handleClose()}
                        type="button"
                        className="mr-2"
                      >
                        Batal
                      </ButtonPrimary>
                      <ButtonPrimary
                        onClick={() => handleToCheckout()}
                        type="button"
                        loading={loading}
                        disabled={disableBtn}
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
    </div>
  );
};

export default EventCard;
