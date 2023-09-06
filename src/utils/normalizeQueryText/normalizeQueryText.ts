const removeLines = ( text: string ): string =>
    text.replace( /\r\n|\n|\r/gm, '' );

const removeTabs = ( text: string ): string =>
    text.replace( /\s\s+/g, ' ' );

const addSpacing = ( text: string ): string =>
    text.replace( /\s*,\s*/g, ', ' )
        .trim();


export const normalizeQueryText = (
    queryText: string
): string => {
    const stringWithNoNewLines = removeLines( queryText );
    const stringWithNoTabs = removeTabs( stringWithNoNewLines );
    const stringWithAddedSpacing = addSpacing( stringWithNoTabs );
    return stringWithAddedSpacing;
};