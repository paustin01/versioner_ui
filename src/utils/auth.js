import {locals} from './locals.js';
import conf from '../config/conf.js';
const Auth = {
pin:{
		valid:(pnum)=>{

			if (pnum == undefined || pnum == '' || pnum.length == 0){
				return false;
			}

			if (!pnum || pnum.length < 4) {
				return false;
            }
            
            if( parseInt(pnum) != conf.api_pin){
                return false;
            }

			return true;
	}
},

valid:(num = false)=>{
	return Auth.pin.valid( num || locals.store.get('pin') );
},

save( num ){
	return locals.store.set('pin', num); 
}


};

export default Auth;
