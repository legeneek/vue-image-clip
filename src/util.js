export function getLeft(el) {
  let left = el.offsetLeft;
  let parent = el.offsetParent;

  while (parent) {
    left += parent.offsetLeft;
    parent = parent.offsetParent;
  }
  return left;
}

export function getTop(el) {
  let top = el.offsetTop;
  let parent = el.offsetParent;

  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return top;
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
