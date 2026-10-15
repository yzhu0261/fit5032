
const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const sgMail = require("@sendgrid/mail");

const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

setGlobalOptions({maxInstances: 2});

// Read the SendGrid API key from Firebase Secret Manager.
const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

// Send an email using SendGrid.
exports.sendEmail = onCall(
    {
      secrets: [sendgridApiKey],
      maxInstances: 2,
    },
    async (request) => {
      // Only signed-in users can send emails.
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Please log in first.");
      }

      const {to, subject, message, attachment} = request.data || {};

      // Check the required email fields.
      if (
        typeof to !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) ||
        typeof subject !== "string" ||
        !subject.trim() ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        throw new HttpsError("invalid-argument", "Invalid email details.");
      }

      const testRecipient = "andnic5566@gmail.com";

      if (to.trim().toLowerCase() !== testRecipient) {
        throw new HttpsError(
            "permission-denied",
            "Only the test recipient is allowed.",
        );
      }

      // Check the attachment before sending.
      if (
        !attachment ||
        typeof attachment.filename !== "string" ||
        typeof attachment.content !== "string" ||
        typeof attachment.type !== "string" ||
        !attachment.filename.trim() ||
        attachment.content.length > 1400000 ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(attachment.content) ||
        !["application/pdf", "text/plain", "text/csv"].includes(attachment.type)
      ) {
        throw new HttpsError("invalid-argument", "Invalid attachment.");
      }

      sgMail.setApiKey(sendgridApiKey.value());

      const email = {
        to: to.trim(),
        from: "andnic5566@gmail.com",
        subject: subject.trim().slice(0, 150),
        text: message.trim().slice(0, 5000),
        attachments: [
          {
            content: attachment.content,
            filename: attachment.filename.slice(0, 100),
            type: attachment.type,
            disposition: "attachment",
          },
        ],
      };

      try {
        await sgMail.send(email);
        return {success: true, message: "Email sent successfully."};
      } catch (error) {
        console.error("Email sending failed:", error.message);
        throw new HttpsError("internal", "Unable to send email.");
      }
    },
);

// Upload the activity data to Firestore.
exports.uploadActivities = onCall(async (request) => {
  // Only the administrator can upload activity data.
  const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

  if (!request.auth || request.auth.uid !== adminUid) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const activities = request.data ? request.data.activities : null;

  // Check that the activity list is valid.
  if (
    !Array.isArray(activities) ||
    activities.length === 0 ||
    activities.length > 100
  ) {
    throw new HttpsError("invalid-argument", "Invalid activity list.");
  }

  // Check the required fields of each activity.
  const validActivities = activities.every((activity) =>
    activity &&
    Number.isInteger(activity.id) &&
    activity.id >= 1 &&
    typeof activity.name === "string" &&
    activity.name.trim() !== "" &&
    typeof activity.type === "string" &&
    ["Tree Planting", "Gardening", "Restoration"].includes(activity.type) &&
    typeof activity.location === "string" &&
    activity.location.trim() !== "" &&
    typeof activity.date === "string" &&
    activity.date.trim() !== "",
  );

  // Check that activity IDs are unique.
  const uniqueIds = new Set(activities.map((activity) => activity.id));

  if (!validActivities || uniqueIds.size !== activities.length) {
    throw new HttpsError("invalid-argument", "Invalid activity data.");
  }

  const db = getFirestore();
  const batch = db.batch();

  activities.forEach((activity) => {
    const activityRef = db.collection("activities").doc(String(activity.id));

    batch.set(activityRef, {
      name: activity.name,
      type: activity.type,
      location: activity.location,
      date: activity.date,
    });
  });

  await batch.commit();

  return {success: true, count: activities.length};
});

// Get registered user statistics for the admin dashboard.
exports.getUserStats = onCall(
    {maxInstances: 2},
    async (request) => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Please log in first.");
      }

      // Check the administrator's Firebase UID.
      const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

      if (request.auth.uid !== adminUid) {
        throw new HttpsError(
            "permission-denied",
            "Administrator access is required.",
        );
      }

      let totalUsers = 0;
      let adminUsers = 0;
      let nextPageToken;

      do {
        const result = await getAuth().listUsers(1000, nextPageToken);

        totalUsers += result.users.length;

        adminUsers += result.users.filter(
            (user) => user.uid === adminUid,
        ).length;

        nextPageToken = result.pageToken;
      } while (nextPageToken);

      const regularUsers = totalUsers - adminUsers;

      return {
        totalUsers,
        adminUsers,
        regularUsers,
      };
    },
);

// Get activity statistics from Firestore.
exports.getActivityStats = onCall(async () => {
  const snapshot = await getFirestore().collection("activities").get();

  const counts = {
    "Tree Planting": 0,
    "Gardening": 0,
    "Restoration": 0,
  };

  snapshot.forEach((doc) => {
    const type = doc.data().type;

    if (Object.prototype.hasOwnProperty.call(counts, type)) {
      counts[type]++;
    }
  });

  return {
    totalActivities: snapshot.size,
    counts,
  };
});
