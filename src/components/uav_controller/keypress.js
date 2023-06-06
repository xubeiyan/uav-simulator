const flags = {
  forward: false,
  backward: false,
  up: false,
  down: false,
  left: false,
  right: false,
  cameraLeft: false,
  cameraRight: false,
  cameraUp: false,
  cameraDown: false,
  cameraTwistLeft: false,
  cameraTwistRight: false,
}

// 判断按下按键
const getFlagForKey = (key) => {
  if (key == 'w') {
    return 'forward';
  } else if (key == 's') {
    return 'backward';
  } else if (key == 'a') {
    return 'left';
  } else if (key == 'd') {
    return 'right';
  } else if (key == 'q') {
    return 'up';
  } else if (key == 'e') {
    return 'down';
  } else if (key == 'i') {
    return 'cameraUp';
  } else if (key == 'k') {
    return 'cameraDown';
  } else if (key == 'j') {
    return 'cameraLeft';
  } else if (key == 'l') {
    return 'cameraRight';
  } else if (key == 'u') {
    return 'cameraTwistLeft';
  } else if (key == 'o') {
    return 'cameraTwistRight';
  } else {
    return undefined;
  }
}

export { getFlagForKey, flags }