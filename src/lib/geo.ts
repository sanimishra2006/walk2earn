import { GPSCoordinate } from '../types';

/**
 * Calculates distance between two GPS coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Anti-cheating validation parameters.
 * Realistic human walking speed: 3.5 - 6.5 km/h. Brisk walking/jogging: up to 12-14 km/h.
 * Speeds above 15 km/h (4.16 m/s) indicate motorized vehicles or GPS glitches.
 */
export const ANTI_CHEAT_CONFIG = {
  MAX_WALK_SPEED_KMH: 15.0, // 15 km/h max walking/jogging speed
  MAX_WALK_SPEED_MS: 15.0 / 3.6, // ~4.16 m/s
  MAX_ALLOWABLE_ACCURACY_M: 60, // Accept GPS pings with error radius <= 60m
  MIN_TIME_DELTA_SEC: 0.8, // Ignore redundant duplicates arriving in < 0.8 second
  MAX_REALISTIC_JUMP_METERS: 70, // A single jump > 70m in 2-3s is a GPS glitch or car acceleration
};

export interface SegmentValidationResult {
  isValid: boolean;
  reason?: string;
  distanceMeters: number;
  speedKmh: number;
}

/**
 * Validates a new GPS point against the last confirmed GPS point.
 */
export function validateGpsSegment(
  prevPoint: GPSCoordinate,
  nextPoint: GPSCoordinate
): SegmentValidationResult {
  // Check accuracy
  if (nextPoint.accuracy > ANTI_CHEAT_CONFIG.MAX_ALLOWABLE_ACCURACY_M) {
    return {
      isValid: false,
      reason: `GPS accuracy too low (±${Math.round(nextPoint.accuracy)}m > ${ANTI_CHEAT_CONFIG.MAX_ALLOWABLE_ACCURACY_M}m threshold)`,
      distanceMeters: 0,
      speedKmh: 0,
    };
  }

  const timeDeltaSeconds = (nextPoint.timestamp - prevPoint.timestamp) / 1000;
  if (timeDeltaSeconds < ANTI_CHEAT_CONFIG.MIN_TIME_DELTA_SEC) {
    return {
      isValid: false,
      reason: 'Redundant GPS timestamp received (<0.8s)',
      distanceMeters: 0,
      speedKmh: 0,
    };
  }

  const distanceMeters = calculateHaversineDistance(
    prevPoint.lat,
    prevPoint.lng,
    nextPoint.lat,
    nextPoint.lng
  );

  // Filter out tiny jitter while standing still (< 1.2 meters)
  if (distanceMeters < 1.2) {
    return {
      isValid: false,
      reason: 'Stationary position jitter (<1.2m)',
      distanceMeters: 0,
      speedKmh: 0,
    };
  }

  const speedMs = distanceMeters / timeDeltaSeconds;
  const speedKmh = speedMs * 3.6;

  // Unrealistic jump
  if (distanceMeters > ANTI_CHEAT_CONFIG.MAX_REALISTIC_JUMP_METERS && timeDeltaSeconds <= 4) {
    return {
      isValid: false,
      reason: `Unrealistic position leap (${Math.round(distanceMeters)}m in ${timeDeltaSeconds.toFixed(1)}s)`,
      distanceMeters: 0,
      speedKmh,
    };
  }

  // Speed check for motorized transport vs walking
  if (speedKmh > ANTI_CHEAT_CONFIG.MAX_WALK_SPEED_KMH) {
    return {
      isValid: false,
      reason: `Speed (${speedKmh.toFixed(1)} km/h) exceeds walking threshold (${ANTI_CHEAT_CONFIG.MAX_WALK_SPEED_KMH} km/h)`,
      distanceMeters: 0,
      speedKmh,
    };
  }

  return {
    isValid: true,
    distanceMeters,
    speedKmh,
  };
}

/**
 * Mobility credit rule:
 * Every 100 meters of eligible walking distance = 1 Mobility Credit.
 * Formula: Base Credits = floor(Valid Walking Distance in Meters / 100).
 * Never round upward.
 * 100m = 1 credit, 350m = 3 credits, 500m = 5 credits, 1km = 10 credits, 2km = 20 credits, 5km = 50 credits.
 */
export function calculateCreditsFromMeters(meters: number): number {
  if (meters <= 0) return 0;
  return Math.floor(meters / 100);
}

export function calculateCreditsFromDistance(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  const meters = distanceKm * 1000;
  return Math.floor(meters / 100);
}

/**
 * Calculate CO2 emissions avoided by walking instead of a motorized trip.
 * Formula: Walking Distance (km) * Selected Vehicle Emission Factor (kg CO2 / km)
 * If transport is 'walking', emission factor is 0 -> avoided is 0.
 */
export function calculateCo2Avoided(distanceKm: number, emissionFactor: number): number {
  if (distanceKm <= 0 || emissionFactor <= 0) return 0;
  const avoided = distanceKm * emissionFactor;
  return Number(avoided.toFixed(3));
}

