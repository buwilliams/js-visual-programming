var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var getState = function() {
  var state = {
    activeObject: null,
    mouseDown: false,
    dragStartX: 0,
    dragEndX: 0,
    dragStartY: 0,
    dragEndY: 0,
    activeStartX: 0,
    activeStartY: 0
  };
  return state;
};

var state = getState();
var objects = [];

var createSquare = function(x, y) {
  objects.push({
    type: 'square',
    x: x, y: y,
    width: 20, height: 20,
    color: '#000000'
  });
}

var events = [];

var touches = function(x, y, object) {
  if((x >= object.x && x <= (object.x + object.height)) &&
    (y >= object.y && y <= (object.y + object.width))) {
    return true;
  } else {
    return false
  }
};

var clear = function() {
  ctx.clearRect(0, 0, 1000, 400);
};

var square = function(object) {
  ctx.fillStyle = object.color;
  ctx.fillRect(object.x, object.y, object.width, object.height);
};

var render = function() {
  clear();
  objects.forEach(function(object) {
    square(object);
  });
};

var handleEvents = function() {
  if(events.length === 0) return;

  var e = events.shift();

  if(e.type === 'contextmenu') {
    createSquare(e.x - (20/2), e.y - (20/2));
  } else if(e.type === 'mousedown') {
    state.mouseDown = true;
    state.dragStartX = e.x;
    state.dragStartY = e.y;
    objects.forEach(function(object) {
      if(touches(e.x, e.y, object)) {
        state.activeObject = object;
        state.activeObject.color = '#FF0000';
        state.activeStartX = object.x;
        state.activeStartY = object.y;
      }
    });
  } else if(e.type === 'mouseup') {
    state.dragEndX = e.x;
    state.dragEndY = e.y;
    state.mouseDown = false;
    if(state.activeObject !== null) {
      state.activeObject.color = '#000000';
      state.activeObject = null;
    }
  } else if(e.type === 'mousemove') {
    if(state.mouseDown === false || state.activeObject === null) return;

    // move it to the new location
    state.activeObject.x = e.x + (state.activeStartX - state.dragStartX);
    state.activeObject.y = e.y + (state.activeStartY - state.dragStartY);
  }

  if(events.length > 0) handleEvents();
}

var loop = function() {
  requestAnimationFrame(loop);
  handleEvents();
  render();
};

canvas.addEventListener('mousedown', function(evt) {
  var rect = c.getBoundingClientRect();
  events.push({
    type: 'mousedown',
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  });
});

canvas.addEventListener('mouseup', function(evt) {
  var rect = c.getBoundingClientRect();
  events.push({
    type: 'mouseup',
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  });
});

canvas.addEventListener('mousemove', function(evt) {
  evt.preventDefault();
  var rect = c.getBoundingClientRect();
  events.push({
    type: 'mousemove',
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  });
});

canvas.addEventListener('contextmenu', function(evt) {
  evt.preventDefault();
  var rect = c.getBoundingClientRect();
  events.push({
    type: 'contextmenu',
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  });
});

loop();
