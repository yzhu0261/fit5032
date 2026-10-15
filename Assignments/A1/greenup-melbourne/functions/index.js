const {setGlobalOptions} = require("firebase-functions");
const {onCall, onRequest, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const sgMail = require("@sendgrid/mail");

const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const {initializeApp} = require("firebase-admin/app");
const admin = require("firebase-admin");

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

// Return environmental activities as JSON.
exports.getActivitiesAPI = onRequest(
    {cors: true},
    async (req, res) => {
      if (req.method !== "GET") {
        res.status(405).json({error: "Method not allowed"});
        return;
      }

      try {
        const snapshot = await getFirestore().collection("activities").get();

        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        res.status(200).json(activities);
      } catch (error) {
        console.error(error);
        res.status(500).json({error: "Unable to load activities"});
      }
    });

// Return activity statistics as JSON.
exports.getActivityStatsAPI = onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
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

    res.status(200).json({
      totalActivities: snapshot.size,
      counts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Unable to load activity statistics"});
  }
});

// Add a new activity to Firestore.
exports.addActivity = onCall(async (request) => {
  const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

  if (!request.auth || request.auth.uid !== adminUid) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const activity = request.data;

  if (
    !activity ||
    typeof activity.name !== "string" ||
    !activity.name.trim() ||
    !["Tree Planting", "Gardening", "Restoration"].includes(activity.type) ||
    typeof activity.location !== "string" ||
    !activity.location.trim() ||
    typeof activity.date !== "string" ||
    !activity.date.trim()
  ) {
    throw new HttpsError("invalid-argument", "Invalid activity data.");
  }

  const db = getFirestore();
  const activityRef = await db.collection("activities").add({
    name: activity.name.trim(),
    type: activity.type,
    location: activity.location.trim(),
    date: activity.date.trim(),
  });

  return {success: true, id: activityRef.id};
});

// Delete an activity from Firestore.
exports.deleteActivity = onCall(async (request) => {
  const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

  if (!request.auth || request.auth.uid !== adminUid) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const activityId = request.data && request.data.id;

  if (typeof activityId !== "string" || !activityId.trim()) {
    throw new HttpsError("invalid-argument", "Invalid activity ID.");
  }

  const db = getFirestore();
  const activityRef = db.collection("activities").doc(activityId);

  const activityDoc = await activityRef.get();

  if (!activityDoc.exists) {
    throw new HttpsError("not-found", "Activity not found.");
  }

  await activityRef.delete();

  return {success: true};
});

// Get registered users for the admin dashboard.
exports.getUsers = onCall(async (request) => {
  const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

  if (!request.auth || request.auth.uid !== adminUid) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const users = [];
  let nextPageToken;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);

    result.users.forEach((user) => {
      users.push({
        uid: user.uid,
        email: user.email || "",
        disabled: user.disabled,
        role: user.uid === adminUid ? "Admin" : "Regular User",
      });
    });

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return {users};
});

// Enable or disable a regular user account.
exports.setUserDisabled = onCall(async (request) => {
  const adminUid = "i6jBpRTLa0dfcphE6n4UjqRNiJS2";

  if (!request.auth || request.auth.uid !== adminUid) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const uid = request.data && request.data.uid;
  const disabled = request.data && request.data.disabled;

  if (typeof uid !== "string" || !uid.trim() ||
      typeof disabled !== "boolean") {
    throw new HttpsError("invalid-argument", "Invalid user data.");
  }

  if (uid === adminUid) {
    throw new HttpsError(
        "permission-denied",
        "The admin account cannot be disabled.",
    );
  }

  await admin.auth().updateUser(uid, {disabled});

  return {success: true};
});
