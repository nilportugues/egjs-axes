export default class TestHelper {
	static wheelVertical(target, value, callback) {
		if (target instanceof Element === false) {
			return;
		}

		const params = {deltaY: value};
		let wheelEvent;

		try {
			wheelEvent = new WheelEvent("wheel", params);
		} catch (e) {
			wheelEvent = document.createEvent("WheelEvent");
			wheelEvent.initEvent("wheel", params);
		}

		function callbackOnce() {
			callback && callback();
			target.removeEventListener("wheel", callbackOnce);// Is this posible??
		}
		target.addEventListener("wheel", callbackOnce);
		target.dispatchEvent(wheelEvent);
	}
	static keyDown(target, value, callback) {
		if (target instanceof Element === false) {
			return;
		}
		let keyboardEvent;

		try {
			keyboardEvent = new KeyboardEvent("keydown", value);
			delete keyboardEvent.keyCode;
			Object.defineProperty(keyboardEvent, "keyCode", {
				"value": value.keyCode,
				"writable": true,
			});
		} catch (e) {
			keyboardEvent = document.createEvent("KeyboardEvent");
			keyboardEvent.initKeyboardEvent("keydown", true, false, null, 0, false, 0, false, value.keyCode, 0);
		}

		function callbackOnce() {
			callback && callback();
			target.removeEventListener("keydown", callbackOnce);// Is this posible??
		}

		target.addEventListener("keydown", callbackOnce);
		target.dispatchEvent(keyboardEvent);
	}
	static keyUp(target, value, callback) {
		if (target instanceof Element === false) {
			return;
		}
		let keyboardEvent;

		try {
			keyboardEvent = new KeyboardEvent("keyup", value);
			delete keyboardEvent.keyCode;
			Object.defineProperty(keyboardEvent, "keyCode", {
				"value": value.keyCode,
				"writable": true,
			});
		} catch (e) {
			keyboardEvent = document.createEvent("KeyboardEvent");
			keyboardEvent.initKeyboardEvent("keyup", true, false, null, 0, false, 0, false, value.keyCode, 0);
		}

		function callbackOnce() {
			callback && callback();
			target.removeEventListener("keyup", callbackOnce);// Is this posible??
		}

		target.addEventListener("keyup", callbackOnce);
		target.dispatchEvent(keyboardEvent);
	}
	/**
	 * looping async function
	 *
	 * @param {*} count loop count
	 * @param {*} loopFunc user loop function
	 * @param {*} complete callback function which called if done.
	 */
	static asyncLoop(count, loopFunc, complete) {
		let i = 0;

		function loop() {
			if (i >= count) {
				complete();
				return;
			}

			loopFunc(i, () => {
				// done
				i++;
				loop();
			});
		}

		loop();
	}
}

