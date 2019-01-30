(function () {
	'use strict';

	function noop() {}

	function run(fn) {
		return fn();
	}

	function blankObject() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function preventDefault(fn) {
		return function(event) {
			event.preventDefault();
			return fn.call(this, event);
		};
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function children (element) {
		return Array.from(element.childNodes);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error(`Function called outside component initialization`);
		return current_component;
	}

	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	let dirty_components = [];

	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			queue_microtask(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	function queue_microtask(callback) {
		Promise.resolve().then(() => {
			if (update_scheduled) callback();
		});
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case — component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detach) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detach);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = {};
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			update: noop,
			not_equal: not_equal$$1,
			bound: blankObject(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blankObject(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.bound[key]) $$.bound[key](value);

				if ($$.ctx) {
					const changed = not_equal$$1(value, $$.ctx[key]);
					if (ready && changed) {
						make_dirty(component, key);
					}

					$$.ctx[key] = value;
					return changed;
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	/* src/App.html generated by Svelte v3.0.0-alpha25 */

	// (54:4) {:else}
	function create_else_block(ctx) {
		var img, img_src_value, img_alt_value, text0, h30, text1_value = ctx.weather.location, text1, text2, h1, text3_value = ctx.weather.temp, text3, text4, text5, h31, text6_value = ctx.weather.forecast, text6, text7, form, input, dispose;

		return {
			c() {
				img = createElement("img");
				text0 = createText("\n    ");
				h30 = createElement("h3");
				text1 = createText(text1_value);
				text2 = createText("\n    ");
				h1 = createElement("h1");
				text3 = createText(text3_value);
				text4 = createText(" °");
				text5 = createText("\n    ");
				h31 = createElement("h3");
				text6 = createText(text6_value);
				text7 = createText("\n    ");
				form = createElement("form");
				input = createElement("input");
				img.src = img_src_value = ctx.weather.icon;
				img.alt = img_alt_value = ctx.weather.forecast;
				h30.className = "svelte-49q1u8";
				h1.className = "svelte-49q1u8";
				h31.className = "svelte-49q1u8";
				setAttribute(input, "type", "text");
				input.className = "svelte-49q1u8";

				dispose = [
					addListener(input, "input", ctx.input_input_handler),
					addListener(form, "submit", preventDefault(ctx.getWeather))
				];
			},

			m(target, anchor) {
				insert(target, img, anchor);
				insert(target, text0, anchor);
				insert(target, h30, anchor);
				append(h30, text1);
				insert(target, text2, anchor);
				insert(target, h1, anchor);
				append(h1, text3);
				append(h1, text4);
				insert(target, text5, anchor);
				insert(target, h31, anchor);
				append(h31, text6);
				insert(target, text7, anchor);
				insert(target, form, anchor);
				append(form, input);

				input.value = ctx.location;
			},

			p(changed, ctx) {
				if ((changed.weather) && img_src_value !== (img_src_value = ctx.weather.icon)) {
					img.src = img_src_value;
				}

				if ((changed.weather) && img_alt_value !== (img_alt_value = ctx.weather.forecast)) {
					img.alt = img_alt_value;
				}

				if ((changed.weather) && text1_value !== (text1_value = ctx.weather.location)) {
					setData(text1, text1_value);
				}

				if ((changed.weather) && text3_value !== (text3_value = ctx.weather.temp)) {
					setData(text3, text3_value);
				}

				if ((changed.weather) && text6_value !== (text6_value = ctx.weather.forecast)) {
					setData(text6, text6_value);
				}

				if (changed.location) input.value = ctx.location;
			},

			d(detach) {
				if (detach) {
					detachNode(img);
					detachNode(text0);
					detachNode(h30);
					detachNode(text2);
					detachNode(h1);
					detachNode(text5);
					detachNode(h31);
					detachNode(text7);
					detachNode(form);
				}

				run_all(dispose);
			}
		};
	}

	// (52:4) {#if loading}
	function create_if_block_1(ctx) {
		var img;

		return {
			c() {
				img = createElement("img");
				img.src = "/spinner.svg";
				img.alt = "loading weather";
			},

			m(target, anchor) {
				insert(target, img, anchor);
			},

			p: noop,

			d(detach) {
				if (detach) {
					detachNode(img);
				}
			}
		};
	}

	// (48:2) {#if error}
	function create_if_block(ctx) {
		var p, text0, text1, text2, button, dispose;

		return {
			c() {
				p = createElement("p");
				text0 = createText("Could not find weather for this location: ");
				text1 = createText(ctx.location);
				text2 = createText("\n  ");
				button = createElement("button");
				button.textContent = "Retry";
				button.type = "button";
				dispose = addListener(button, "click", ctx.retry);
			},

			m(target, anchor) {
				insert(target, p, anchor);
				append(p, text0);
				append(p, text1);
				insert(target, text2, anchor);
				insert(target, button, anchor);
			},

			p(changed, ctx) {
				if (changed.location) {
					setData(text1, ctx.location);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(p);
					detachNode(text2);
					detachNode(button);
				}

				dispose();
			}
		};
	}

	function create_fragment(ctx) {
		var main;

		function select_block_type(ctx) {
			if (ctx.error) return create_if_block;
			if (ctx.loading) return create_if_block_1;
			return create_else_block;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(ctx);

		return {
			c() {
				main = createElement("main");
				if_block.c();
				main.className = "svelte-49q1u8";
			},

			m(target, anchor) {
				insert(target, main, anchor);
				if_block.m(main, null);
			},

			p(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(ctx);
					if (if_block) {
						if_block.c();
						if_block.m(main, null);
					}
				}
			},

			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(main);
				}

				if_block.d();
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		// state
	let weather = {
	  location: '',
	  temp: '0',
	  forecast: 'n/a',
	  icon: 'https://placehold.it/50/50'
	};
	let location = '';
	let loading = true;
	let error = false;

	onMount(() => {
	  location = 'charleston'; $$invalidate('location', location);
	  getWeather();
	});

	function getWeather() {
	  loading = true; $$invalidate('loading', loading);
	  fetch(`https://weather.twilson63.xyz/?q=${location}`)
	    .then(r => r.json())
	    .then(doc => {
	      if (doc.error) {
	        error = true; $$invalidate('error', error); 
	        return
	      }
	      weather = doc; $$invalidate('weather', weather);
	      loading = false; $$invalidate('loading', loading);
	      location = ''; $$invalidate('location', location);
	    })
	    .catch(err => {
	      error = true; $$invalidate('error', error);

	    });
	}

	function retry() {
	  loading = false; $$invalidate('loading', loading);
	  error = false; $$invalidate('error', error);
	  location = ''; $$invalidate('location', location);
	}

		function input_input_handler() {
			location = this.value;
			$$invalidate('location', location);
		}

		return {
			weather,
			location,
			loading,
			error,
			getWeather,
			retry,
			input_input_handler
		};
	}

	class App extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal);
		}
	}

	new App({target: document.body});

}());
