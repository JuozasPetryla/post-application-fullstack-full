import io from "socket.io-client";

function createSocket(url) {
  return io(url || "https://post-application-f823a2a81cb3.herokuapp.com/", {
    transports: ["websocket"],
  });
}
let socket = createSocket();

export default function createWebSocketPlugin() {
  return (store) => {
    socket.on("newPost", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `A post with the id of ${data} was created`
      );
    });

    socket.on("updatedPost", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `A post with the id of ${data} was edited`
      );
    });

    socket.on("deletePost", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `A post with the id of ${data} was deleted`
      );
    });
    socket.on("newAuthor", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `An author with the id of ${data} was created`
      );
    });

    socket.on("updatedAuthor", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `An author with the id of ${data} was edited`
      );
    });

    socket.on("deleteAuthor", (data) => {
      store.dispatch("openNotification");
      store.dispatch(
        "getNotificationText",
        `An author with the id of ${data} and all his posts were was deleted`
      );
    });
  };
}

export function updateWebSocketURL(url) {
  socket.disconnect();
  socket = createSocket(url);
}
