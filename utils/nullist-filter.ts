// write out a nullish filter function
// it has to accept an array or object or boolean
// it has to return true or false
export default <T>(value: T): boolean => {
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
    }
    return !!value;
}
