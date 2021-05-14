const str_helpers = {
    truncate:(str, len=50, end='') => {
        return (str.length > len) ? str.substring(0, (len-end.length))+end : str;
    },

    trimSpecial:(str)=>{
        return str.replace(/[^0-9A-Za-z\s-]/gi, '').trim();
    },

    toBool:(str)=>{
        if (str == 'false' || str == '0' || str == '' || !str || str=='null'){
            return false;
        }
        return true;
    },
}


export default str_helpers;