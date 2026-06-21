import {
  cls,
  type IntrinsicProps,
  normalizeStyle,
  type SolidStyle,
  styleObject,
  withoutClass,
} from '../shared';
import { computeMargins } from './utils/compute-margins';

export type TextProps = Readonly<IntrinsicProps<'p'>>;

export function Text(props: TextProps) {
  const style = styleObject(props.style);
  const margins = computeMargins(style);
  if (margins['margin-top'] === undefined) margins['margin-top'] = '16px';
  if (margins['margin-bottom'] === undefined) margins['margin-bottom'] = '16px';
  const textStyle: SolidStyle = {
    'font-size': '14px',
    'line-height': '24px',
    ...style,
    ...margins,
  };
  return (
    <p
      {...withoutClass(props)}
      {...(cls(props) ? { class: cls(props) } : {})}
      style={normalizeStyle(textStyle)}
    >
      {props.children}
    </p>
  );
}
