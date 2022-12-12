import React, { useEffect } from 'react';
import SectionGridFeaturePlaces from './SectionGridFeaturePlaces';
import SectionHowItWork from 'components/SectionHowItWork/SectionHowItWork';
import BackgroundSection from 'components/BackgroundSection/BackgroundSection';
import BgGlassmorphism from 'components/BgGlassmorphism/BgGlassmorphism';
import { TcsProductType } from 'data/types';
import Slider from 'react-slick';
import { POST } from 'utils/apiHelper';
import { getStorage, getTitleWebsite } from 'utils/localStorage';
import { CONFIG_STR } from 'contains/contants';
import convertNumbThousand from 'utils/convertNumbThousand';
import { encode } from 'js-base64';
import Heading from 'components/Heading/Heading';
import { Helmet } from 'react-helmet';
import checkFileExt from 'utils/checkFileExt';

function PageHome3() {
  const [tcsProduct, setTcsProduct] = React.useState<TcsProductType[]>([]);
  const [tcsEvent, setTcsEvent] = React.useState<TcsProductType[]>([]);
  const [config, setConfig] = React.useState<any>(null);

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
    getInformationTcsProduct();
    getInformationTcsEvent();
  }, []);

  React.useEffect(() => {
    if (!config) {
      let config = getStorage(CONFIG_STR);
      if (config) {
        setConfig(config);
      }
    }
  }, [config]);

  const getInformationTcsProduct = () => {
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
      };
      POST('/mtcs/list/index', body)
        .then((tcs) => {
          let product: TcsProductType[] = [];
          if (tcs.result.length > 0) {
            tcs.result.map((item: any) => {
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
            setTcsProduct(product);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getInformationTcsEvent = () => {
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
      };
      POST('/mevent-tcs/list/index', body)
        .then((tcs) => {
          let product: TcsProductType[] = [];
          if (tcs.result.length > 0) {
            tcs.result.map((item: any) => {
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
                price: '',
                embedMap: item.embedMap,
              });
            });
            setTcsEvent(product);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1500,
  };

  if (!tcsProduct) {
    return null;
  }
  return (
    <div className="nc-PageHome3 relative overflow-hidden">
      <Helmet>
        <title>{getTitleWebsite()}</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      {/* SECTION HERO */}
      <Slider {...settings}>
        {config?.imageBanner.map((item: any) => {
          const fileType = checkFileExt(item);

          if (fileType === 'image') {
            return (
              <img
                src={item}
                alt=""
                className="object-fill h-[35vh] md:h-[50vh] lg:h-[80vh]"
              />
            );
          } else if (fileType === 'video') {
            return (
              <div>
                <video
                  width="100%"
                  height="auto"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                  id="myVideo"
                  data-ll-status="loaded"
                >
                  <source data-src={item} src={item} />
                </video>
              </div>
            );
          }

          return <></>;
        })}
      </Slider>
      <div className="container relative space-y-24 mb-24 mt-0 sm:mt-10">
        {/* SECTION */}
        <div className="relative py-8 md:py-16">
          <BackgroundSection />
          <SectionGridFeaturePlaces
            stayListings={tcsProduct.slice(0, 4)}
            tcsEvent={tcsEvent.slice(0, 4)}
          />
        </div>
        <SectionHowItWork />
        <div>
          <Heading isCenter desc="">
            Tentang Kami
          </Heading>
          <span className="block text-neutral-500 dark:text-neutral-400 text-center">
            {config?.about}
          </span>
        </div>
        {/* SECTION */}
        {/* <SectionSubscribe2 /> */}
      </div>
    </div>
  );
}

export default PageHome3;
