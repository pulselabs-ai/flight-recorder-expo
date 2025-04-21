# PulseLabs FlightRecorder SDK Integration Guide for Expo

This guide provides step-by-step instructions for integrating the PulseLabs FlightRecorder SDK into your Expo React Native project.

## Overview

The FlightRecorderSDK allows you to capture user sessions and interactions in your React Native application. The SDK is native and must be configured separately for iOS and Android after generating native code with Expo prebuild.

## Prerequisites

- Expo React Native project
- GitHub account
- GitHub Personal Access Token with `read:packages` scope
- PulseLabs Account and API Key (obtainable from [your PulseLabs dashboard](https://productlab.pulselabs.ai/))

## Compatibility

- **Expo SDK:** 50+
- **React Native:** 0.73+
- **iOS:** 13.0+
- **Android:** `minSdkVersion` 21+, `compileSdkVersion` 33+ (Target SDK 33+)

## Step 1: Generate Native Code with Expo Prebuild

First, you need to generate the native iOS and Android projects:

```sh
npx expo prebuild
```

This command will create/update the `ios` and `android` directories with native code.

## Android Integration

### Step 1: Set Up GitHub Credentials

The FlightRecorderSDK is distributed via GitHub Packages, which requires authentication:

1. **Create GitHub Personal Access Token**:
   - Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
   - Click "Generate new token" (classic)
   - Select the `read:packages` scope
   - Generate and copy your token

2. **Add GitHub Properties File**:
   - Create a file at `android/github.properties` (do not commit this file)
   - Add the following content:
     ```properties
     gpr.user=YOUR_GITHUB_USERNAME
     gpr.token=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
     ```

3. **Update .gitignore**:
   - Add `android/github.properties` to your `.gitignore` file

### Step 2: Configure Gradle Files

1. **Update settings.gradle**:
   - Open `android/settings.gradle`
   - Add the following code at the end of the file:
     ```gradle
     // Load GitHub properties file if it exists
     def githubPropertiesFile = new File(rootProject.projectDir, "github.properties")
     def githubProperties = new Properties()
     
     if (githubPropertiesFile.exists()) {
         githubProperties.load(new FileInputStream(githubPropertiesFile))
     } else {
         logger.warn("github.properties file not found. Create one from github.properties.template")
         // Set default empty values to avoid build failures
         githubProperties.setProperty("gpr.user", "")
         githubProperties.setProperty("gpr.token", "")
     }
     
     dependencyResolutionManagement {
         repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
         repositories {
             google()
             mavenCentral()
             maven { url "https://www.jitpack.io" }
             maven {
                 url = "https://maven.pkg.github.com/pulselabs-ai/flight-recorder-android-package"
                 credentials {
                     username = githubProperties.getProperty("gpr.user") ?: ""
                     password = githubProperties.getProperty("gpr.token") ?: ""
                 }
             }
         }
     }
     ```

2. **Update app/build.gradle**:
   - Open `android/app/build.gradle`
   - Add the FlightRecorderSDK dependencies in the dependencies block:
     ```gradle
     dependencies {
         // Existing dependencies...
         
         // Material3 dependency required by FlightRecorderSDK
         implementation 'androidx.compose.material3:material3:1.2.1'
         
         // Flight Recorder SDK
         implementation("ai.pulselabs:flightrecorder:1.4.1")
     }
     ```

### Step 3: Initialize the SDK in Android

1. **Update MainActivity.kt**:
   - Open `android/app/src/main/java/com/YOUR_PACKAGE/MainActivity.kt`
   - Import the SDK: `import ai.pulselabs.flightrecorder.FlightRecorderSdk`
   - Add the initialization in the `onCreate` method:
     ```kotlin
     override fun onCreate(savedInstanceState: Bundle?) {
         // Existing code...
         super.onCreate(null)
         
         // Initialize Flight Recorder SDK
         FlightRecorderSdk(
             this,
             lifecycle,
             this,
             "YOUR_PULSELABS_API_KEY", // Replace with your API key
             automaticallyShowIntroduction = false
         )
     }
     ```

## iOS Integration

### Step 1: Add FlightRecorderSDK via Swift Package Manager

1. **Open Xcode**:
   ```sh
   cd ios && xed .
   ```
   This will open your Xcode workspace.

2. **Add the Swift Package**:
   - In Xcode, select your project in the Project Navigator
   - Go to File → Add Packages...
   - Enter the package URL: `https://github.com/pulselabs-ai/flight-recorder-swift-package`
   - Select "Up to Next Major Version" with "1.0.0" as the minimum version
   - Click "Add Package"
   - Select the "PulseLabsFlightRecorderSDK" package product
   - Choose your app's target and click "Add Package"

### Step 2: Initialize the SDK in iOS

1. **Update AppDelegate.mm**:
   - Open `ios/YourProjectName/AppDelegate.mm`
   - Add the import at the top of the file:
     ```objc
     #import <PulseLabsFlightRecorderSDK/PulseLabsFlightRecorderSDK-Swift.h>
     ```
   - Initialize the SDK in the `application:didFinishLaunchingWithOptions:` method:
     ```objc
     - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
     {
       self.moduleName = @"main";
       
       // Initialize Flight Recorder
       [FlightRecorderSDK startWithApiKey:@"YOUR_PULSELABS_API_KEY"
            automaticallyShowIntroduction:false];
       
       // Existing code...
       
       return [super application:application didFinishLaunchingWithOptions:launchOptions];
     }
     ```

## Running Your App

After integrating the SDK, you need to build and run your app using Expo CLI:

```sh
# Start Metro bundler
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

Note: You cannot use Expo Go since it doesn't support native modules. You must use the development build created by `npx expo prebuild`.

## Triggering FlightRecorder via Device Shake

After installation, you can access the FlightRecorder functionality by shaking the device:

Shaking the device will stop the current recording session and display a sheet where users can:
- Add additional details about the session
- Review the recorded interactions
- Submit the recording to PulseLabs

This behavior works the same way on both iOS and Android platforms.

## Important Notes for Expo Projects

1. **Native Module Support**: FlightRecorderSDK requires native code, so you cannot use it with Expo Go. You must use development builds.

2. **Prebuild Changes**: If you modify your app.json/app.config.js and run `npx expo prebuild` again, your native changes will be overwritten. Consider using [config plugins](https://docs.expo.dev/guides/config-plugins/) for more robust integration.

3. **EAS Build**: If you're using EAS Build, you'll need to configure it to handle the GitHub authentication for Android. See the [EAS Build Private Packages documentation](https://docs.expo.dev/build-reference/private-npm-packages/).

## Troubleshooting

### Android Build Issues

- Verify your GitHub token has the correct permissions
- Check `github.properties` file exists and contains valid credentials
- Ensure the repository URL in `settings.gradle` is correct

### iOS Build Issues

- Make sure the Swift Package Manager can access the repository
- Verify the import path is correct in AppDelegate.mm
- Check that the SDK initialization is properly called

## Support

If you encounter any issues with the FlightRecorderSDK integration, please contact [support@pulselabs.ai](mailto:support@pulselabs.ai).
