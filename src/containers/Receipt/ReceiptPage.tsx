import { FC, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/id';

import { QRCodeSVG } from 'qrcode.react';
import { decode } from 'js-base64';
import convertNumbThousand from 'utils/convertNumbThousand';
import { getTitleWebsite } from 'utils/localStorage';
import { Helmet } from 'react-helmet';
import * as transactionActions from 'redux/actions/transaction';
import { GET_RECEIPT } from 'utils/apiHelper';
import ReCAPTCHA from 'react-google-recaptcha';

export interface ReceiptPageProps {
    className?: string;
}

const ReceiptPage: FC<ReceiptPageProps> = ({ className = '' }) => {
    const [receiptData, setReceiptData] = useState<any>(null);
    const [visibleCaptcha, setVisibleCaptcha] = useState<boolean>(false);

    let { id }: any = useParams();
    const captchaRef = useRef<any>(null)
    useEffect(() => {
        if (id) {
            getInformationReceipt();
        }
    }, [id]);

    const getInformationReceipt = async () => {
        let query = id;
        try {
            let receipt = await GET_RECEIPT("/public/biller-booking/invoice/" + query);
            if (receipt) {
                setReceiptData(receipt?.result?.result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!visibleCaptcha) {
            setVisibleCaptcha(true);
        } else {
            const token = captchaRef.current.getValue();
            const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : ""}&response=${token}`, {
                method: 'GET',
                mode: "no-cors"
            });
            console.log(response)
            captchaRef.current.reset();
        }
    }

    let totalTicket = 0;
    receiptData?.reportingDetail?.map((item: any) => {
        totalTicket += item?.productQty
    })
    const renderContent = () => {
        return (
            <div className="flex flex-col">
                <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        {
                            receiptData?.header?.paymentCategory === "NOT SELECTED" ? "Pesanan Anda Belum Dibayar" : "Pesanan Anda Berhasil 🎉"
                        }
                    </h2>

                    <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

                    {/* ------------------------ */}
                    <div className="space-y-6">
                        <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                            <div className="flex-1 p-5 flex space-x-4">
                                <svg
                                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                                        stroke="#D1D5DB"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <div className="flex flex-col">
                                    <span className="text-sm text-neutral-400">
                                        Tanggal Pembayaran
                                    </span>
                                    <span className="mt-1.5 text-lg font-semibold">
                                        {moment(receiptData?.header?.paymentDate).format(
                                            'llll'
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-5 flex space-x-4">
                                <svg
                                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
                                        stroke="#D1D5DB"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <div className="flex flex-col">
                                    <span className="text-sm text-neutral-400">
                                        Jumlah Tiket
                                    </span>
                                    <span className="mt-1.5 text-lg font-semibold">
                                        {totalTicket} Tiket
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ------------------------ */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Detail Pesanan</h3>
                        <div className="flex flex-col space-y-4">
                            <div className="flex text-neutral-6000 dark:text-neutral-300">
                                <span className="flex-1">Tanggal Pesanan</span>
                                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                    {moment(
                                        receiptData?.header?.bookingDate
                                    ).format('ll')}
                                </span>
                            </div>
                            <div className="flex text-neutral-6000 dark:text-neutral-300">
                                <span className="flex-1">No Transaksi</span>
                                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                    {receiptData?.header?.bookingRef}
                                </span>
                            </div>
                            {/* <div className="flex text-neutral-6000 dark:text-neutral-300">
                                <span className="flex-1">Total Pembayaran</span>
                                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                    Rp{' '}
                                    {convertNumbThousand(
                                        receiptData?.header?.paymentTotal
                                    )}
                                </span>
                            </div> */}
                            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span className="flex-1">Metode Pembayaran</span>
                                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                    {receiptData?.header?.paymentCategory}
                                </span>
                            </div>
                            {receiptData?.reportingDetail?.map(
                                (item: any, index: number) => (
                                    <div key={index} className="flex justify-between ">
                                        <p className="flex-1 text-neutral-6000">
                                            {item.productName} x{item.productQty}
                                        </p>
                                        <p className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                            Rp.{convertNumbThousand(item.productPrice)}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span className="flex-1">Total pembayaran</span>
                            <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                                Rp.
                                {convertNumbThousand(
                                    receiptData?.header?.paymentTotal
                                )}
                            </span>
                        </div>
                    </div>
                    {/* Detail Pengunjung */}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center mt-2">
                        {
                            visibleCaptcha ?
                                <ReCAPTCHA
                                    ref={captchaRef}
                                    sitekey={process.env.REACT_APP_SITE_KEY ? process.env.REACT_APP_SITE_KEY : ""}
                                /> : null
                        }
                        <button
                            type="submit"
                            className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-11 md:mt-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        >
                            Kirim Ulang Invoice
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className={`nc-ReceiptPage ${className}`} data-nc-id="ReceiptPage">
            <Helmet>
                <title>{getTitleWebsite()} - Paydone</title>
            </Helmet>
            <main className="container mt-11 mb-24 lg:mb-32 ">
                <div className="max-w-4xl mx-auto">{renderContent()}</div>
            </main>
        </div>
    );
};

export default ReceiptPage;
