/// <reference types="@tauri-apps/api" />

// Add Web Bluetooth API type definitions
declare global {
  interface Window {
    // This extends the existing Window interface with the Web Bluetooth API
    Bluetooth: typeof BluetoothDevice;
    BluetoothUUID: BluetoothUUID;
  }
}

// This makes the file a module
export {};
