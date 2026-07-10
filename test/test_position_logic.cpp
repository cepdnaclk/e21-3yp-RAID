#include <unity.h>
#include <cmath>
#include <limits>

#define UNIT_TEST
#include "../src/position_logic.h"

long enc_totalTicks = 0;
long enc_anchorTicks = 0;
float enc_anchorDistM = 0.0f;
double enc_lastBearing = 0.0;
bool enc_originSet = false;
double enc_originLat = 0.0;
double enc_originLng = 0.0;
double enc_anchorLat = 0.0;
double enc_anchorLng = 0.0;

float encoder_getBestDistM()
{
    return enc_anchorDistM;
}

static GpsFix currentFix;

static GpsFix fakeGpsProvider()
{
    return currentFix;
}

static double metersToLatitudeDegrees(double meters)
{
    return meters * 180.0 / (3.14159265358979323846 * 6371000.0);
}

static void resetEncoderState()
{
    enc_totalTicks = 0;
    enc_anchorTicks = 0;
    enc_anchorDistM = 0.0f;
    enc_lastBearing = 0.0;
    enc_originSet = false;
    enc_originLat = 0.0;
    enc_originLng = 0.0;
    enc_anchorLat = 0.0;
    enc_anchorLng = 0.0;
}

void setUp()
{
    resetEncoderState();
    currentFix = {false, 0.0, 0.0};
    gpsFixProvider = fakeGpsProvider;
}

void tearDown()
{
    gpsFixProvider = nullptr;
}

void testHaversineM_samePoint_returnsZero()
{
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, haversineM(7.8731, 80.7718, 7.8731, 80.7718));
}

void testHaversineM_antimeridianCoordinates_returnsFiniteDistance()
{
    float distance = haversineM(0.0, -180.0, 0.0, 180.0);
    TEST_ASSERT_TRUE(isfinite(distance));
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, distance);
}

void testHaversineM_nanInput_returnsNaN()
{
    TEST_ASSERT_TRUE(std::isnan(haversineM(std::numeric_limits<double>::quiet_NaN(), 0.0, 0.0, 0.0)));
}

void testMaybeUpdateGpsAnchor_firstValidFix_setsOriginAndAnchor()
{
    currentFix = {true, 0.0, 0.0};

    maybeUpdateGpsAnchor();

    TEST_ASSERT_TRUE(enc_originSet);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_originLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_originLng);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLng);
}

void testMaybeUpdateGpsAnchor_invalidFix_leavesStateUnchanged()
{
    currentFix = {false, 0.0, 0.0};

    maybeUpdateGpsAnchor();

    TEST_ASSERT_FALSE(enc_originSet);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLng);
}

void testMaybeUpdateGpsAnchor_fixJustBelowGate_keepsExistingAnchor()
{
    enc_originSet = true;
    enc_originLat = 0.0;
    enc_originLng = 0.0;
    enc_anchorLat = 0.0;
    enc_anchorLng = 0.0;
    enc_anchorTicks = 7;
    enc_totalTicks = 21;
    enc_anchorDistM = 3.5f;

    currentFix = {true, metersToLatitudeDegrees(9.99), 0.0};

    maybeUpdateGpsAnchor();

    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLng);
    TEST_ASSERT_EQUAL(7, enc_anchorTicks);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 3.5f, enc_anchorDistM);
}

void testMaybeUpdateGpsAnchor_fixExactlyAtGate_updatesAnchor()
{
    enc_originSet = true;
    enc_originLat = 0.0;
    enc_originLng = 0.0;
    enc_anchorLat = 0.0;
    enc_anchorLng = 0.0;
    enc_anchorTicks = 7;
    enc_totalTicks = 21;
    enc_anchorDistM = 3.5f;

    currentFix = {true, metersToLatitudeDegrees(GPS_ANCHOR_GATE_M), 0.0};

    maybeUpdateGpsAnchor();

    TEST_ASSERT_FLOAT_WITHIN(0.0001f, metersToLatitudeDegrees(GPS_ANCHOR_GATE_M), enc_anchorLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLng);
    TEST_ASSERT_EQUAL(21, enc_anchorTicks);
}

void testMaybeUpdateGpsAnchor_fixAboveGate_updatesAnchor()
{
    enc_originSet = true;
    enc_originLat = 0.0;
    enc_originLng = 0.0;
    enc_anchorLat = 0.0;
    enc_anchorLng = 0.0;
    enc_anchorTicks = 7;
    enc_totalTicks = 42;
    enc_anchorDistM = 3.5f;

    currentFix = {true, metersToLatitudeDegrees(10.01), 0.0};

    maybeUpdateGpsAnchor();

    TEST_ASSERT_FLOAT_WITHIN(0.0001f, metersToLatitudeDegrees(10.01), enc_anchorLat);
    TEST_ASSERT_EQUAL_DOUBLE(0.0, enc_anchorLng);
    TEST_ASSERT_EQUAL(42, enc_anchorTicks);
}

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(testHaversineM_samePoint_returnsZero);
    RUN_TEST(testHaversineM_antimeridianCoordinates_returnsFiniteDistance);
    RUN_TEST(testHaversineM_nanInput_returnsNaN);
    RUN_TEST(testMaybeUpdateGpsAnchor_invalidFix_leavesStateUnchanged);
    RUN_TEST(testMaybeUpdateGpsAnchor_firstValidFix_setsOriginAndAnchor);
    RUN_TEST(testMaybeUpdateGpsAnchor_fixJustBelowGate_keepsExistingAnchor);
    RUN_TEST(testMaybeUpdateGpsAnchor_fixExactlyAtGate_updatesAnchor);
    RUN_TEST(testMaybeUpdateGpsAnchor_fixAboveGate_updatesAnchor);
    UNITY_END();
}

void loop()
{
}