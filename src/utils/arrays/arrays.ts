export const chunkArray = <T>(
    array: Array<T>
    , chunkSize: number
): Array<Array<T>> => {
    const chunks: Array<Array<T>> = [];

    if (
        chunkSize < 0
        || array?.length === 0
    ) {
        return chunks;
    }

    let sliceIndex = 0;

    while (
        sliceIndex < array.length
    ) {
        const chunk = array
            .slice(
                sliceIndex
                , sliceIndex + chunkSize
            );

        chunks.push( chunk );
        sliceIndex = sliceIndex + chunkSize;
    }

    return chunks;
};