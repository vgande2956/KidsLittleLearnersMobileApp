# Little Learners for Android

A standalone Android app for Little Learners. It runs in its own Android app window and loads the production learning app at https://kidslearningapp-94co.onrender.com.

## Online and offline behavior

- An internet connection is required the first time the app opens, and for sign-in, email verification, and other account services.
- After a successful online launch, the website's service worker caches the app shell and learning assets. Learning activities can then open offline when those assets have been cached.
- Account and email services remain online-only. Offline support is for cached learning content, not offline account creation or synchronization.

## Android Studio

Requirements: Node.js 20+, Android Studio with the Android SDK, and Java 17.

1. Clone this repository and open its folder in a terminal.
2. Install dependencies and generate/synchronize the native Android project:

   ```sh
   npm install
   npm run android:setup
   ```

3. Open the generated project in Android Studio:

   ```sh
   npm run android:open
   ```

4. Choose an emulator or connected device and run the app. In Android Studio, use **Build > Build Bundle(s) / APK(s) > Build APK(s)** to make an installable debug APK.

The **Build Android APK** GitHub Actions workflow also builds a separate APK. Run it from **Actions**, then download the `little-learners-android-apk` artifact from the completed workflow run. Extract the ZIP and install `app-debug.apk` on an Android device. This debug APK is for direct testing; Google Play publishing requires a signed release bundle.

## Updating

The mobile shell is separate from the website repository. The shell's URL is set in `capacitor.config.json`. The online website can update independently; native project changes require rebuilding the APK. Cached offline content updates the next time the app connects and the service worker refreshes.
