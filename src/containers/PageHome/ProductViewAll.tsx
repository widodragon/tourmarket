import React, { useEffect } from 'react';
import SectionSubscribe2 from 'components/SectionSubscribe2/SectionSubscribe2';
import SectionGridFeaturePlaces from './SectionGridFeaturePlaces';
import SectionHowItWork from 'components/SectionHowItWork/SectionHowItWork';
import BackgroundSection from 'components/BackgroundSection/BackgroundSection';
import BgGlassmorphism from 'components/BgGlassmorphism/BgGlassmorphism';
import { TaxonomyType, TcsProductType } from 'data/types';
import Slider from 'react-slick';
import { POST } from 'utils/apiHelper';
import { getStorage, getTitleWebsite } from 'utils/localStorage';
import { CONFIG_STR } from 'contains/contants';
import convertNumbThousand from 'utils/convertNumbThousand';
import { encode } from 'js-base64';
import Heading from 'components/Heading/Heading';
import StayCard from 'components/StayCard/StayCard';
import { Helmet } from "react-helmet";
import ButtonPrimary from 'shared/Button/ButtonPrimary';

const renderCard = (stay: TcsProductType) => {
    return <StayCard key={stay.id} data={stay} />;
};

function ProductViewAll(props: any) {
    const [tcsProduct, setTcsProduct] = React.useState<TcsProductType[]>([]);
    const [tcsEvent, setTcsEvent] = React.useState<TcsProductType[]>([]);
    const [config, setConfig] = React.useState<any>(null);
    const [limit, setLimit] = React.useState(8);
    const [totalPages, setTotalPages] = React.useState(0);
    const [offsetData, setOffsetData] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    // CUSTOM THEME STYLE
    useEffect(() => {
        const $body = document.querySelector('body');
        if (!$body) return;
        $body.classList.add('theme-purple-blueGrey');
        return () => {
            $body.classList.remove('theme-purple-blueGrey');
        };
    }, []);

    React.useEffect(() => {
        getInformationTcsProduct({ draw: 1 });
        getInformationTcsEvent({ draw: 1 });
    }, []);

    React.useEffect(() => {
        if (!config) {
            let config = getStorage(CONFIG_STR);
            if (config) {
                setConfig(config);
            }
        }
    }, [config]);

    const onLoadMore = () => {
        if (offsetData < totalPages - 1) {
            setOffsetData(offsetData + 1);
            if (props.location.state.tabActive === 'Wisata') {
                getInformationTcsProduct({
                    offset: limit * (offsetData + 1),
                    draw: 0
                })
            } else {
                getInformationTcsEvent({
                    offset: limit * (offsetData + 1),
                    draw: 0
                })
            }
        }
    }

    const getInformationTcsProduct = ({ offset = 0, draw = 1 }) => {
        if (draw === 0) {
            setLoading(true);
        }
        setLoading(true);
        let config = getStorage(CONFIG_STR);
        if (config) {
            let body = {
                hirarki: config.hirarki,
                cid: '',
                provinceName: '',
                cityName: '',
                tcsName: '',
                level: 0,
                isActive: 1,
                isMerchant: 2,
                sortBy: 'TERBARU',
                sortOrder: 'DESC',
                draw: draw,
                limit: limit,
                offset: offset
            };
            POST('/mtcs/listv2/index', body)
                .then((tcs) => {
                    let product: TcsProductType[] = [];
                    if (draw === 1) {
                        setTotalPages(Math.ceil(tcs?.result?.totalData / limit));
                    }
                    if (tcs.result?.listData?.length > 0) {
                        tcs.result?.listData?.map((item: any) => {
                            product.push({
                                id: item.id,
                                cid: item.cid,
                                href: '/listing-stay-detail?key=' + encode(item.cid),
                                title: item.name,
                                description: item.tcsConfig.description,
                                featuredImage: item.imageThumbnail,
                                address: item.cityName + ', ' + item.provinceName,
                                like: item.rating,
                                galleryImgs:
                                    item.tcsConfig.imageGallery?.length > 0
                                        ? item.tcsConfig.imageGallery
                                        : [
                                            'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg',
                                        ],
                                price:
                                    convertNumbThousand(item.minPrice) +
                                    ' - ' +
                                    convertNumbThousand(item.maxPrice),
                                embedMap: item.tcsConfig.embedMap,
                            });
                        });
                        setTcsProduct([...tcsProduct, ...product]);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    const getInformationTcsEvent = ({ offset = 0, draw = 1 }) => {
        if (draw === 0) {
            setLoading(true);
        }
        setLoading(true);
        let config = getStorage(CONFIG_STR);
        if (config) {
            let body = {
                hirarki: config.hirarki,
                eventCode: '',
                eventStartDate: '',
                eventEndDate: '',
                eventCity: '',
                eventProvince: '',
                isDisabled: 2,
                draw: draw,
                limit: limit,
                offset: offset
            };
            POST('/mevent-tcs/listv2/index', body)
                .then((tcs) => {
                    let product: TcsProductType[] = [];
                    if (tcs.result?.listData.length > 0) {
                        tcs.result?.listData.map((item: any) => {
                            let passingCode = {
                                eventCode: item.eventCode,
                                hirarki: item.hirarki,
                                eventStartDate: item.eventStartDate,
                                eventEndDate: item.eventEndDate,
                                imageGallery: item.imageGallery,
                                embedMap: item.embedMap,
                                name: item.eventName,
                                eventCategory: item.eventCategory,
                            };
                            product.push({
                                id: item.id,
                                cid: item.cid,
                                href:
                                    '/listing-event-detail?key=' +
                                    encode(JSON.stringify(passingCode)),
                                title: item.eventName,
                                description: item.eventDescription,
                                featuredImage: item.imageThumbnail,
                                address: item.eventCity + ', ' + item.eventProvince,
                                like: item?.rating,
                                galleryImgs:
                                    item.imageGallery?.length > 0
                                        ? item.imageGallery
                                        : [
                                            'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg',
                                        ],
                                price: '0',
                                embedMap: item.embedMap,
                            });
                        });
                        setTcsEvent(product);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    const settings = {
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    if (!tcsProduct) {
        return null;
    }
    return (
        <div className="nc-ProductViewAll relative overflow-hidden">
            <Helmet>
                <title>{getTitleWebsite()} - View All</title>
            </Helmet>
            {/* GLASSMOPHIN */}
            <BgGlassmorphism />
            <div className="container relative space-y-24 mb-24 mt-0 md:mt-20">
                {/* SECTION */}
                <Heading desc="" className='mt-10 md:mt-0 -mb-14 md:mb-0'>
                    {props.location.state.tabActive === 'Wisata' ? "Destinasi Wisata" : "Event Tersedia"}
                </Heading>
                <div className="relative py-16">
                    <BackgroundSection />
                    {/* <SectionGridFeaturePlaces stayListings={tcsProduct} tcsEvent={tcsEvent} /> */}
                    <div
                        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
                    >
                        {props.location.state.tabActive === 'Wisata'
                            ? tcsProduct?.map((stay) => renderCard(stay))
                            : tcsEvent?.map((stay) => renderCard(stay))}
                    </div>
                    {
                        offsetData < totalPages - 1 ?
                            <div className="flex mt-16 justify-center items-center">
                                <ButtonPrimary loading={loading} onClick={() => onLoadMore()}>Show me more</ButtonPrimary>
                            </div> : null
                    }
                </div>
            </div>
        </div>
    );
}

export default ProductViewAll;
