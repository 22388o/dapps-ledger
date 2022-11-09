import React from 'react';
import clsx from 'clsx';

function getButtonStyle({
  buttonType,
  variant,
}: {
  buttonType: 'primary' | 'secondary' | 'action';
  variant?: 'fill' | 'outline';
}) {
  const btnStyle: string = buttonType + '-' + variant;
  let styles;

  switch (btnStyle) {
    case 'primary-fill':
      styles = clsx(
        'bg-cgreen text-white hover:bg-cgreenHover hover:text-white active:bg-cgreenHover disabled:!text-white/40 disabled:!bg-cgreen/40 disabled:hover:text-white/40 disabled:hover:bg-cgreen/40',
        'dark:bg-cgreenDark dark:hover:!bg-cgreenDarkHover dark:active:!bg-cgreenDarkHover dark:disabled:!bg-cgreenDark/40 dark:disabled:!text-white/40 dark:disabled:hover:!bg-cgreenDark/40 dark:disabled:hover:!text-white/40'
      );
      break;
    case 'primary-outline':
      styles = clsx(
        'bg-black text-white hover:bg-lightBlack hover:text-white active:bg-black disabled:!text-gray disabled:!bg-grayTretiary disabled:hover:text-gray disabled:hover:text-gray disabled:hover:bg-grayTretiary',
        'dark:bg-cgreenDark dark:text-white dark:hover:text-white dark:hover:bg-cgreenDarkHover dark:active:bg-cgreenDarkHover'
      );
      break;
    case 'secondary-fill':
      styles = clsx(
        'text-white bg-cgreen hover:bg-cgreenHover active:bg-cgreenHover disabled:!text-white/40 disabled:!bg-cgreen/40 disabled:hover:text-white/40 disabled:hover:bg-cgreen/40'
      );
      break;
    case 'action-fill':
      styles = clsx(
        'bg-black text-white hover:bg-lightBlack hover:text-white active:bg-black disabled:!text-gray disabled:!bg-grayTretiary disabled:hover:text-gray disabled:hover:text-gray disabled:hover:bg-grayTretiary',
        'dark:bg-[#394247] dark:hover:!bg-[#404B51] dark:active:!bg-[#394247] dark:disabled:!bg-[#4D585F] dark:disabled:!text-white/30'
      );
  }
  return styles;
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: 'primary' | 'secondary' | 'action';
  variant?: 'fill' | 'outline';
  children: React.ReactNode;
};

export function Button({
  className,
  children,
  buttonType = 'primary',
  variant = 'fill',
  ...rest
}: Props) {
  const styles = getButtonStyle({ buttonType, variant });

  return (
    <button
      className={clsx(
        'h-10 font-semibold uppercase tracking-widest',
        'cursor-pointer rounded-2lg px-5 text-center text-xs',
        styles,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
