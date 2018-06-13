// ------------------------------------------------------------
// REBOOT - TOAST LIBRARY
// Popup messages like from a toaster
// ------------------------------------------------------------

// Import dependencies
import Vue from 'vue';
import { uniqueId } from 'lodash';
import Icon	from '../components/Icon';

const Toast = Vue.extend({
	data() {
		return {
			queue : []
		};
	},
	template : '<div id="toast">' +
		'<transition-group name="toast" tag="div">' +
			'<div v-for="message in queue" :class="[\'message\', message.type]" :key="message.id">' +
				'<div v-if="message.icon" class="type-icon"><icon :type="icon(message)" size="24"/></div>' +
				'<div class="content">' +
					'<div v-if="message.title" class="title">{{message.title}}</div>' +
					'{{message.content}}' +
				'</div>' +
				'<div class="close" @click="pop(message.id)"><icon type="close" size="24"/></div>' +
			'</div>' +
		'</transition-group>' +
	'</div>',
	methods : {
		// Return the correct icon
		icon(message) {
			if (message.icon !== false) {
				if (typeof message.icon === 'string') {
					return message.icon;
				}
				else {
					switch(message.type) {
						case 'info':
							return 'information';
							break;
						case 'success':
							return 'check';
							break;
						case 'warning':
							return 'alert-triangle';
							break;
						case 'error':
							return 'alert-octogon';
							break;
					}
				}
			}
			return null;
		},

		// Push a toast message onto the queue
		push(params) {
			let id = uniqueId('toast-');
			this.queue.push({
				id      : id,
				icon    : params.icon || false,
				title   : params.title || null,
				content : params.message,
				type    : params.type || 'info'
			});
			setTimeout(() => {
				this.pop(id);
			}, params.timeout || this.$options.timeout);
		},

		// Remove a toast message from the queue
		pop(id) {
			this.queue.forEach((item, index) => {
				if (item.id === id) {
					this.queue.splice(index, 1);
				}
			});
		},

		// Add a success message to the queue
		success(message, timeout) {
			this.push({
				icon    : true,
				title   : 'Success',
				message : message,
				type    : 'success',
				timeout : timeout
			});
		},

		// Add an error message to the queue
		error(message, timeout) {
			this.push(message, 'error', timeout);
		},

		// Add an info message to the queue
		info(message, timeout) {
			this.push(message, 'info', timeout);
		},

		// Add a warning message to the queue
		warning(message, timeout) {
			this.push(message, 'warning', timeout);
		}
	},
	components : {
		Icon
	}
});

// Export the toaster
export default {
	init : function(options) {
		let settings = Object.assign({
			parent : 'body',
			timeout : 3000
		}, options);

		// Create the #toast element and append to the DOM
		let toast = document.querySelector('#toast');
		if (!toast) {
			toast = document.createElement('div');
			toast.id = 'toast';
			document.querySelector(settings.parent).appendChild(toast);
		}

		// Create an instance of the toast component
		const toaster = new Toast();
		toaster.$options.timeout = settings.timeout;

		// Mount the toast component to the DOM
		toaster.$mount('#toast');

		return toaster;
	}
};