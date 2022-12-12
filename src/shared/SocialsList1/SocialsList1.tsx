import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import { getStorage } from "utils/localStorage";
import { CONFIG_STR } from "contains/contants";

export interface SocialsList1Props {
  className?: string;
}

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-2.5" }) => {
  const [socials, setSocials] = React.useState<SocialType[]>([]);
  React.useEffect(() => {
    let config = getStorage(CONFIG_STR);
    if (config) {
      setSocials(
        [
          { name: "Facebook", icon: "lab la-facebook-square", href: "https://" + config.facebookUrl },
          { name: "Twitter", icon: "lab la-twitter", href: "https://" + config.twitterUrl },
          { name: "Youtube", icon: "lab la-youtube", href: "https://" + config.youtubeUrl },
          { name: "Instagram", icon: "lab la-instagram", href: "https://" + config.instagramUrl },
        ]
      )
    }
  }, []);
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <i className={item.icon}></i>
        <span className="hidden lg:block text-sm">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
