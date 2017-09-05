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

