export type report = 'ApCi' | 'EA';
export type typeAccount = 1 | 2 | 3 | 4;

type Font = {
    fontFamily: string;
    fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export enum TypescaleKey {
    displayLarge = 'displayLarge',
    displayMedium = 'displayMedium',
    displaySmall = 'displaySmall',

    headlineLarge = 'headlineLarge',
    headlineMedium = 'headlineMedium',
    headlineSmall = 'headlineSmall',

    titleLarge = 'titleLarge',
    titleMedium = 'titleMedium',
    titleSmall = 'titleSmall',

    labelLarge = 'labelLarge',
    labelMedium = 'labelMedium',
    labelSmall = 'labelSmall',

    bodyLarge = 'bodyLarge',
    bodyMedium = 'bodyMedium',
    bodySmall = 'bodySmall',
}

export type Fonts = {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: Font['fontWeight'];
    lineHeight: number;
    fontSize: number;
};

export type FontsTypescale = {
    [key in TypescaleKey]: Fonts;
};