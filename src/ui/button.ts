import { ButtonProps, ButtonVariant, ButtonSize } from '../types';

export function getButtonClasses(props: ButtonProps = {}): string {
  const variant: ButtonVariant = props.variant ?? 'icon';
  const size: ButtonSize = props.size ?? 'md';

  const baseByVariant: Record<ButtonVariant, string> = {
    icon: 'md2-btn-base md2-btn-icon',
    outlined: 'md2-btn-base md2-btn-outlined',
    text: 'md2-btn-base md2-btn-text',
    contained: 'md2-btn-base md2-btn-contained',
  };

  const sizeMap: Record<ButtonSize, string> = {
    sm: 'md2-size-sm',
    md: 'md2-size-md',
    lg: 'md2-size-lg',
  };

  const extras: string[] = [];

  const classes = [
    baseByVariant[variant],
    sizeMap[size],
    'transition-colors duration-200',
    props.extraClassName ?? ''
  ]
    .concat(extras)
    .filter(Boolean)
    .join(' ')
    .trim();

  return classes;
}


