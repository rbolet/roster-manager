/**
 * CSS Color utility type
 * Represents a valid CSS color value that can be used in CSS properties
 *
 * Accepts:
 * - Named colors: "red", "blue", "green", etc.
 * - Hex: "#ff0000", "#f00", "#ff0000ff"
 * - RGB/RGBA: "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)"
 * - HSL/HSLA: "hsl(0, 100%, 50%)", "hsla(0, 100%, 50%, 0.5)"
 *
 * Excludes special values like "transparent", "currentColor", "inherit", "initial", "unset"
 */
declare const CssColorBrand: unique symbol;

export type CssColor = string & { [CssColorBrand]: never };

/**
 * Type guard to validate and cast a string to CssColor
 * Performs basic validation of CSS color formats
 */
export function isCssColor(value: unknown): value is CssColor {
  if (typeof value !== 'string') return false;

  const normalized = value.trim().toLowerCase();

  // Basic validation patterns
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  const rgbPattern = /^rgba?\s*\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(,\s*[\d.]+%?\s*)?\)$/;
  const hslPattern = /^hsla?\s*\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(,\s*[\d.]+%?\s*)?\)$/;

  return (
    hexPattern.test(value) ||
    rgbPattern.test(value.replace(/\s+/g, '')) ||
    hslPattern.test(value.replace(/\s+/g, '')) ||
    CSS_NAMED_COLORS.has(normalized)
  );
}

/**
 * Error thrown when a value fails CssColor validation
 */
export class InvalidCssColorError extends Error {
  constructor(value: unknown) {
    super(`Invalid CSS color: ${String(value)}`);
    this.name = 'InvalidCssColorError';
  }
}

/**
 * Validates and casts a string to CssColor
 * Throws InvalidCssColorError if validation fails
 *
 * @throws {InvalidCssColorError} If the value is not a valid CSS color
 */
export function asCssColor(value: string): CssColor {
  if (isCssColor(value)) {
    return value;
  }
  throw new InvalidCssColorError(value);
}

// CSS named colors (excluding special values like transparent, currentColor, inherit, etc.)
const CSS_NAMED_COLORS = new Set([
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
]);
