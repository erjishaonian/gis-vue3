import axios from 'axios'
import cryptoObj from '@/assets/cryp'

axios.defaults.baseURL = 'http://localhost:3300'

axios.defaults.timeout = 10000; //超时毫秒 60s
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentails = true;

// axios请求拦截
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么:
	// 如果需要在header头中传token，使用下边这段代码
	if(localStorage.getItem('token')){
		config.headers['token'] = localStorage.getItem('token');
	}
	return config;
}, error => {
	// 对请求错误做些什么
	return Promise.reject(error);
})


// axios响应拦截器
axios.interceptors.response.use(
	response => {
		// 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
		// 否则的话抛出错误
		if (response.status === 200) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	error => {
		if (error.response.status) {
			switch (error.response.status) {
				// 404请求不存在
				case 404:
					// Toast.fail('网络请求不存在');
					break;
				case 500:
					// Toast.fail('内部服务器错误');
					break;
					// 其他错误，直接抛出错误提示
				default:
					// Toast.fail(error.response.data.msg);
			}
			return Promise.reject(error.response);
		}
	}
);




/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = {}) {
	// 如果需要在请求的参数中传token，使用下边这段代码
	// let token = localStorage.getItem('token') || '';
	// if (params.__proto__.constructor.name == "Object") {
	// 	token && (params.token = token);
	// 	params = qs.stringify(params);
	// } else if (params.__proto__.constructor.name == "FormData") {
	// 	token && (params.append("token", token));
	// }
	
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
			if (res.data.code == -2000) {
				Toast.fail(res.data.message);
				localStorage.clear();
				setTimeout(() => {
					router.replace({
						path: '/login',
						query: {
							redirect: router.currentRoute.fullPath
						}
					});
				}, 1000);
				return;
			} else if (res.data.code !== 200) {
				Toast.fail(res.message);
			}
			resolve(res.data);
		}).catch(err => {
			// Toast.close();
			Toast.fail('网络请求错误');
			reject(error.data)
		})
	});
}


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, method, data = {}) {
	// 如果需要在请求的参数中传token，使用下边这段代码
	// let token = localStorage.getItem('token') || '';
	// if (params.__proto__.constructor.name == "Object") {
	// 	token && (params.token = token);
	// 	params = qs.stringify(params);
	// } else if (params.__proto__.constructor.name == "FormData") {
	// 	token && (params.append("token", token));
	// }

	return new Promise((resolve, reject) => {
		let param = {'method': method, 'data': data}
		param = JSON.stringify(param)
		
		axios.post(url, {data: cryptoObj.encryptFunc(param)}).then(res => {
			// Toast.close();
			if(res.data.code == -2000){
				// Toast.fail(res.data.message);
				localStorage.clear();
				setTimeout(() => {
					router.replace({
						path: '/index',
						query: {
							redirect: router.currentRoute.fullPath
						}
					});
				}, 1000);
			}else if (res.data.code !== 200) {
				// Toast.fail(res.data.message);
			}
			resolve(res.data);
		}).catch(error => {
			// Toast.close();
			// Toast.fail('网络请求错误');
			reject(error)
		})
	});
}

var http = {
	get,
	post
};
export default http




// export default axios
