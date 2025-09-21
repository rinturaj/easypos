// Type definitions for Web Bluetooth API
// These are minimal type definitions for the Web Bluetooth API

declare class BluetoothDevice extends EventTarget {
    readonly id: string;
    readonly name?: string;
    readonly gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: 'gattserverdisconnected', listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
}

declare class BluetoothRemoteGATTServer {
    readonly device: BluetoothDevice;
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
}

declare class BluetoothRemoteGATTService {
    readonly device: BluetoothDevice;
    readonly uuid: string;
    getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
}

declare class BluetoothRemoteGATTCharacteristic {
    readonly service: BluetoothRemoteGATTService;
    readonly uuid: string;
    writeValue(value: BufferSource): Promise<void>;
    readValue(): Promise<DataView>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: 'characteristicvaluechanged', listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
}

interface BluetoothRequestDeviceOptions {
    filters: BluetoothLEScanFilter[];
    optionalServices?: (string | number)[];
}

interface BluetoothLEScanFilter {
    services?: (string | number)[];
    name?: string;
    namePrefix?: string;
}

interface Navigator {
    bluetooth: {
        requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
    };
}
