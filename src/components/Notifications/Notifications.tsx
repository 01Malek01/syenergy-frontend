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
                className="notification border-t-2 border-b-2 border-blue-500 hover:bg-slate-300"
                key={index}
              >
                <p>{notification?.message}</p>
              </div>
              <span
                className="text-sm text-red-600 cursor-pointer hover:underline"
                onClick={clear}
              >
                Clear all
              </span>
            </>
          );
        })
      ) : (
        <p className="text-center text-sm">No new notifications</p>
      )}
    </div>
  );
}

export default Notifications;
