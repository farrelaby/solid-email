import {
  cls,
  type IntrinsicProps,
  normalizeStyle,
  styleObject,
  withoutClass,
} from '../shared';
export type ImgProps = Readonly<IntrinsicProps<'img'>>;

export function Img(props: ImgProps) {
  const classValue = cls(props);
  return (
    <img
      {...withoutClass(props)}
      {...(classValue ? { class: classValue } : {})}
      alt={props.alt ?? ''}
      style={normalizeStyle({
        display: 'block',
        outline: 'none',
        border: 'none',
        'text-decoration': 'none',
        ...styleObject(props.style),
      })}
    />
  );
}
