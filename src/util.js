export function getLeft(el) {
  let left = el.offsetLeft;
  let parent = el.offsetParent;

  while (parent) {
    left += parent.offsetLeft;
    parent = parent.offsetParent;
  }
  return left;
}

export function throttle(fn, wait, ctx) {
  let t = null;

  return function (...args) {
    if (t) {
      clearTimeout(t);
      t = null;
    }

    setTimeout(function () {
      fn.call(ctx, ...args);
    }, wait);
  }
}
