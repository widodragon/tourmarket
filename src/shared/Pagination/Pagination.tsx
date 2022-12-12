import { CustomLink } from 'data/types';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import twFocusClass from 'utils/twFocusClass';

const DEMO_PAGINATION: CustomLink[] = [
  {
    label: '1',
    href: '#',
  },
  {
    label: '2',
    href: '#',
  },
  {
    label: '3',
    href: '#',
  },
  {
    label: '4',
    href: '#',
  },
  {
    label: '5',
    href: '#',
  },
  {
    label: '6',
    href: '#',
  },
  {
    label: '7',
    href: '#',
  },
  {
    label: '8',
    href: '#',
  },
  {
    label: '9',
    href: '#',
  },
  {
    label: '10',
    href: '#',
  },
  {
    label: '11',
    href: '#',
  },
  {
    label: '12',
    href: '#',
  },
  {
    label: '13',
    href: '#',
  },
  {
    label: '14',
    href: '#',
  },
  {
    label: '15',
    href: '#',
  },
];

export interface PaginationProps {
  className?: string;
}

const Pagination: FC<PaginationProps> = ({ className = '' }) => {
  const renderItem = (pag: CustomLink, index: number) => {
    if (index === 0) {
      // RETURN ACTIVE PAGINATION
      return (
        <span
          key={index}
          className={`inline-flex w-9 h-9 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}
        >
          {pag.label}
        </span>
      );
    }
    // RETURN UNACTIVE PAGINATION
    return (
      <Link
        key={index}
        className={`inline-flex w-9 h-9 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
        to={pag.href}
      >
        {pag.label}
      </Link>
    );
  };

  return (
    <nav
      className={`nc-Pagination inline-flex flex-1 space-x-1 text-base font-medium ${className}`}
    >
      {DEMO_PAGINATION.map(renderItem)}
    </nav>
  );
};

export default Pagination;
