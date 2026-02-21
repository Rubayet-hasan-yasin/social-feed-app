import Expo, { ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo();

export type NotificationType = "like" | "comment";

export interface SendNotificationOptions {
  /** Expo push token of the recipient (e.g. ExponentPushToken[xxxx]) */
  pushToken: string;
  type: NotificationType;
  /** Username of the person who performed the action */
  actorUsername: string;
  postId: string;
}

/**
 * Sends a push notification via Expo's push service.
 * Works for both Android (FCM) and iOS (APNs) — Expo handles the routing.
 * Silently skips if the token is missing or not a valid Expo push token.
 */
export const sendPushNotification = async ({
  pushToken,
  type,
  actorUsername,
  postId,
}: SendNotificationOptions): Promise<void> => {
  if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;

  const title =
    type === "like" ? "Someone liked your post 🔥" : "New comment on your post 💬";
  const body =
    type === "like"
      ? `${actorUsername} liked your post.`
      : `${actorUsername} commented on your post.`;

  const message: ExpoPushMessage = {
    to: pushToken,
    title,
    body,
    data: { type, postId, actorUsername },
    sound: "default",
  };

  try {
    const [ticket] = await expo.sendPushNotificationsAsync([message]);
    if (ticket.status === "error") {
      console.error(`❌ Expo push error: ${ticket.message}`);
    } else {
      console.log(`📬 Expo push sent, receipt id: ${ticket.id}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Expo push send error: ${error.message}`);
    }
  }
};
