const subscribers = {};

export const publish = (eventName, data) => {
  if (!Array.isArray(subscribers[eventName])) {
    return;
  }
  subscribers[eventName].forEach((callback) => {
    callback(data);
  });
};

export const subscribe = (eventName, callback) => {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = [];
  }
  subscribers[eventName].push(callback);

  const index = subscribers[eventName].length - 1;
  return {
    unsubscribe() {
      subscribers[eventName].splice(index, 1);
    }
  }
};
