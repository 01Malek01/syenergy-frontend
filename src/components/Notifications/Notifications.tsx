function Notifications({
  notifications,
  clear,
}: {
  notifications: Notification[];
  clear: () => void;
}) {
  return (
    <div className="container">
      {notifications?.length > 0 ? (
        notifications?.map((notification: Notification, index: number) => {
          return (
            <>
              <div
                className="notification border-t-2 border-b-2 border-blue-500 hover:bg-slate-300 mb-3"
                key={index}
              >
                <p>{notification?.message}</p>
              </div>
            </>
          );
        })
      ) : (
        <p className="text-center text-sm">No new notifications</p>
      )}
      {notifications?.length > 0 && (
        <span
          className="text-sm text-red-600 cursor-pointer hover:underline"
          onClick={clear}
        >
          Clear all
        </span>
      )}
    </div>
  );
}

export default Notifications;
