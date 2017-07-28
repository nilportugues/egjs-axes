import Coordinate from "./Coordinate";

export interface Axis {
  [key: string]: number
};

export class AxisManager {
  private _pos: Axis;
  static equal(target: Axis, base: Axis): boolean {
    for (const k in target) {
      if (target[k] !== base[k]) {
        return false;
      }
    }
    return true;
  }
  constructor(private options: AxesOption) {
    this._pos = Object.keys(this.options.axis).reduce((acc, v) => {
      acc[v] = this.options.axis[v].range[0];
      return acc;
    }, {});
  }
  get(axes?: string[] | Axis): Axis {
    if (axes && Array.isArray(axes)) {
      return axes.reduce((acc, v) => {
        if (v && (v in this._pos)) {
          acc[v] = this._pos[v];
        }
        return acc;
      }, {});
    } else {
      return { ...this._pos, ...<Axis>(axes || {}) };
    }
  }
  moveTo(pos: Axis): { [key: string]: Axis } {
    const delta = this.map(this._pos, (v, key) => {
      return pos[key] ? pos[key] - this._pos[key] : 0;
    });

    this.set(pos);
    return {
      pos: { ...this._pos },
      delta
    };
  }
  set(pos: Axis) {
    for (const k in pos) {
      if (k && (k in this._pos)) {
        this._pos[k] = pos[k];
      }
    }
  }
  every(
    pos: Axis,
    callback: (value: number, key: string, options: AxisOption) => boolean): boolean {
    const axisOptions = this.options.axis;
    for (const k in pos) {
      if (k) {
        if (!callback(pos[k], k, axisOptions[k])) {
          return false;
        }
      }
    }
    return true;
  }
  filter(
    pos: Axis,
    callback: (value: number, key: string, options: AxisOption) => boolean): Axis {
    const filtered: Axis = {};
    const axisOptions = this.options.axis;
    for (const k in pos) {
      if (k) {
        callback(pos[k], k, axisOptions[k]) && (filtered[k] = pos[k]);
      }
    }
    return filtered;
  }
  map(
    pos: Axis,
    callback: (value: number, key: string, options: AxisOption) => any);
  map(
    pos: Axis,
    callback: (value: number, key: string, options: AxisOption) => number): Axis {
    const tranformed: Axis = {};
    const axisOptions = this.options.axis;
    for (const k in pos) {
      if (k) {
        tranformed[k] = callback(pos[k], k, axisOptions[k]);
      }
    }
    return tranformed;
  }
  isOutside(axes?: string[]) {
    return !this.every(
      axes ? this.get(axes) : this._pos,
      (v, k, opt) => !Coordinate.isOutside(v, opt.range)
    );
  }
};
