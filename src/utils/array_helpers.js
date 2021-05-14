
const array_helpers = {

    dynamicSort:(property) => {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },

    all_match:(array) => {
        return array.every( (val, i, arr) => val === arr[0]);
    },

}


export default array_helpers;