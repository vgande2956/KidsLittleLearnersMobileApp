# Little Learners for Android

The Android app is a separate mobile experience bundled inside the APK. It does not open or embed the Little Learners website. The full learning app (English, Telugu, Hindi, Maths, and General Knowledge activities, with their images and word data) lives in `app/`; `npm run build` assembles it into `www/` together with a native account bridge. Account requests go to the same production authentication API and users database as the website.

The Dockerfile and `render.yaml` deploy a separate hosted copy of the mobile UI. Nginx serves the bundled app and proxies browser account requests to the existing production API, keeping session cookies on the mobile service origin. This Render service does not replace or create the website backend or its users database.

## Accounts and connectivity

- Sign up, email verification, login, session restore, and logout use `https://kidslearningapp-94co.onrender.com/api/auth/`.
- The Android app uses the backend's `ll_session` HttpOnly cookie through a native Capacitor plugin. Credentials and session cookies are not stored in the web page.
- Existing website accounts work in the mobile app, and accounts created in the mobile app are available on the website after email verification.
- An internet connection is required for account services. The mobile app screens and included learning interactions are packaged locally.

## Android Studio

Requirements: Node.js 20+, Android Studio with the Android SDK, and Java 17.

1. Clone this repository and open its folder in a terminal.
2. Install dependencies, bundle the app, and generate/synchronize the native Android project:

   ```sh
   npm install
   npm run build
   npm run android:setup
   npm run android:sync
   ```

3. Open the generated project in Android Studio:

   ```sh
   npm run android:open
   ```

4. Choose an emulator or connected device and run the app. In Android Studio, use **Build > Build Bundle(s) / APK(s) > Build APK(s)** to make an installable debug APK.

The **Build Android APK** GitHub Actions workflow also builds a separate APK. Run it from **Actions**, then download the `little-learners-android-apk` artifact from the completed workflow run. Extract the ZIP and install `app-debug.apk` on an Android device. This debug APK is for direct testing; Google Play publishing requires a signed release bundle.

## Updating

The mobile app is separate from the website repository. Its source is under `app/` (learning content and UI) and `native/` (account bridge and Android plugin). To pick up web changes, copy the updated files from the website's `src/` into `app/` (excluding `sw.js` and `manifest.webmanifest`). Rebuild and sync the Android project after any change.
