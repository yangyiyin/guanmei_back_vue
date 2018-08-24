import { baseUrl } from './env'
import {getStore} from '@/config/mUtils'
import store from '../store/'

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	if (url.indexOf('//') == -1) {
		url = baseUrl + url;
	} else {

	}

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
			data = data ? data : {};
			data.token = getStore('token') ? getStore('token') : '';
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		
		try {
			store.commit('set_percentage', 2);
			var time = 0;
			var interval = setInterval(function(){
				if (time > 100) {
					if (interval) clearInterval(interval);
				}
				store.commit('add_percentage', 1);
				time++;
			},50)
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			if (interval) clearInterval(interval);
			store.commit('set_percentage', 0);
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	} else {

		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/json");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}