export const locals = {
	store:{

		set:(key, value="")=>{
			return localStorage.setItem(key, value);
		},

		setjson:(key, value=[])=>{
			return locals.store.set(key, JSON.stringify(value)); 
		},

		get:(key)=>{
			return localStorage.getItem(key);
		},

		getjson:(key, _def=false)=>{
			let item = locals.store.get(key);
            return (item == undefined) ? _def :  JSON.parse(item);
		},

		rmv:(key)=>{
			return localStorage.removeItem(key);
		},

		clr:()=>{
			return localStorage.clear();
		},
	}

};
