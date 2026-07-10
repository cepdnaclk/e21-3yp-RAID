import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

const mapComponentSpy = vi.fn(() => null);
const clientState = {
    subscribeCallback: undefined as ((frame: { body: string }) => void) | undefined,
};

vi.mock("../../src/components/Map", () => ({
    default: mapComponentSpy,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useSearchParams: () => [new URLSearchParams("lat=7.8731&lng=80.7718&focus=crack-1"), vi.fn()],
    };
});

vi.mock("sockjs-client", () => ({
    default: vi.fn(),
}));

vi.mock("@stomp/stompjs", () => {
    class MockClient {
        webSocketFactory?: () => unknown;
        reconnectDelay?: number;
        debug?: () => void;
        onConnect?: () => void;
        onStompError?: (frame: { headers: Record<string, string>; body: string }) => void;

        constructor(config: Record<string, unknown>) {
            Object.assign(this, config);
        }

        activate() {
            this.onConnect?.();
        }

        deactivate() {
            return Promise.resolve();
        }

        subscribe(_destination: string, callback: (frame: { body: string }) => void) {
            clientState.subscribeCallback = callback;
            return { unsubscribe: vi.fn() };
        }
    }

    return { Client: MockClient };
});

describe("parsePayload and MapPage stream parsing", () => {
    beforeEach(() => {
        mapComponentSpy.mockClear();
        clientState.subscribeCallback = undefined;
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    sensorId: "IR_Bottom",
                    timestamp: "2026-07-10T10:00:00Z",
                    deviceId: "esp-001",
                    crackDetected: true,
                    status: "CRITICAL",
                    lat: 7.8731,
                    lng: 80.7718,
                    severity: 0.9,
                },
                {
                    sensorId: "broken",
                    timestamp: "2026-07-10T10:05:00Z",
                    deviceId: "esp-001",
                    crackDetected: true,
                    status: "CRITICAL",
                },
            ],
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("parsePayload_nestedLocation_returnsParsedCrackLocation", async () => {
        const { parsePayload } = await import("../../src/pages/MapPage");

        const payload = {
            sensorId: "IR_Bottom",
            timestamp: "2026-07-10T10:00:00Z",
            deviceId: "esp-001",
            crackDetected: true,
            status: "CRITICAL",
            location: { lat: 7.8731, lng: 80.7718 },
            severity: "0.85",
        };

        expect(parsePayload(payload)).toMatchObject({
            sensorId: "IR_Bottom",
            timestamp: "2026-07-10T10:00:00Z",
            deviceId: "esp-001",
            crackDetected: true,
            status: "CRITICAL",
            lat: 7.8731,
            lng: 80.7718,
            severity: 0.85,
        });
    });

    it("parsePayload_flatLatitudeLongitude_fallsBackToLegacyFieldNames", async () => {
        const { parsePayload } = await import("../../src/pages/MapPage");

        const payload = {
            sensorId: "IR_Top",
            timestamp: "2026-07-10T10:10:00Z",
            deviceId: "esp-002",
            crackDetected: false,
            status: "OK",
            latitude: "7.5000",
            longitude: "80.6000",
            severity: 0,
        };

        expect(parsePayload(payload)).toMatchObject({
            sensorId: "IR_Top",
            deviceId: "esp-002",
            lat: 7.5,
            lng: 80.6,
            severity: 0,
        });
    });

    it("parsePayload_missingLatLng_returnsNull", async () => {
        const { parsePayload } = await import("../../src/pages/MapPage");

        expect(
            parsePayload({
                sensorId: "IR_Bottom",
                timestamp: "2026-07-10T10:00:00Z",
                deviceId: "esp-001",
                crackDetected: true,
                status: "CRITICAL",
            })
        ).toBeNull();
    });

    it("parsePayload_nullPayload_returnsNull", async () => {
        const { parsePayload } = await import("../../src/pages/MapPage");

        expect(parsePayload(null)).toBeNull();
    });

    it("MapPage_invalidJsonMessage_logsParseErrorAndKeepsStreamAlive", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const { default: MapPage } = await import("../../src/pages/MapPage");

        render(<MapPage />);

        await waitFor(() => expect(mapComponentSpy).toHaveBeenCalled());
        expect(mapComponentSpy.mock.calls.at(-1)?.[0]).toMatchObject({
            markers: [
                expect.objectContaining({
                    id: "IR_Bottom-2026-07-10T10:00:00Z",
                    lat: 7.8731,
                    lng: 80.7718,
                }),
            ],
        });

        await waitFor(() => expect(clientState.subscribeCallback).toBeDefined());
        clientState.subscribeCallback?.({ body: "{" });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Failed to parse /topic/cracks payload",
            expect.any(SyntaxError)
        );
    });
});