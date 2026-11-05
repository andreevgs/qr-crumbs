import LZString from 'lz-string';
import { CompactPayload, QuestStep, StepLayout, ThemeSeed } from '../types';

const VALID_THEMES: ThemeSeed[] = ['violet', 'rose', 'amber', 'emerald', 'cyan'];
const VALID_LAYOUTS: StepLayout[] = ['standard', 'blur', 'codeLock'];

const LEGACY_ICON_MAP: Record<string, string> = {
  gift: 'redeem',
  flame: 'local_fire_department',
  snowflake: 'ac_unit',
  heart: 'favorite',
  key: 'vpn_key',
  sparkles: 'celebration',
  drop: 'water_drop',
  water: 'water_drop',
  gamepad: 'sports_esports',
  game: 'sports_esports',
  videogame_asset: 'sports_esports',
  controller: 'sports_esports',
};

/**
 * Encodes a QuestStep object into a compact, compressed, URL-safe string.
 */
export function encodeQuestStep(step: QuestStep): string {
  const payload: CompactPayload = {
    t: step.title.trim(),
    m: step.message.trim(),
    c: VALID_THEMES.includes(step.theme) ? step.theme : 'violet',
    i: step.icon || 'redeem',
    l: VALID_LAYOUTS.includes(step.layout) ? step.layout : 'standard',
  };

  if (step.stepBadge && step.stepBadge.trim().length > 0) {
    payload.b = step.stepBadge.trim();
  }

  if (step.secretHint && step.secretHint.trim().length > 0) {
    payload.h = step.secretHint.trim();
  }

  if (step.layout === 'codeLock' && step.unlockCode && step.unlockCode.trim().length > 0) {
    payload.u = step.unlockCode.trim();
  }

  const jsonString = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(jsonString);
}

/**
 * Decodes a compressed URL-safe string back into a QuestStep object.
 * Returns null if string is corrupted, invalid JSON, or doesn't match schema.
 */
export function decodeQuestStep(encoded: string): QuestStep | null {
  if (!encoded || typeof encoded !== 'string') {
    return null;
  }

  try {
    let decompressed = LZString.decompressFromEncodedURIComponent(encoded);

    // In case the hash was double encoded or decoded by browser
    if (!decompressed) {
      try {
        decompressed = LZString.decompressFromEncodedURIComponent(decodeURIComponent(encoded));
      } catch {
        // ignore
      }
    }

    if (!decompressed) {
      return null;
    }

    const parsed = JSON.parse(decompressed) as Partial<CompactPayload>;

    // Validate required fields
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    if (typeof parsed.t !== 'string' || typeof parsed.m !== 'string') {
      return null;
    }

    const theme: ThemeSeed =
      parsed.c && VALID_THEMES.includes(parsed.c as ThemeSeed)
        ? (parsed.c as ThemeSeed)
        : 'violet';

    let icon = typeof parsed.i === 'string' && parsed.i.trim().length > 0 ? parsed.i.trim() : 'redeem';
    if (LEGACY_ICON_MAP[icon]) {
      icon = LEGACY_ICON_MAP[icon];
    }

    const layout: StepLayout =
      parsed.l && VALID_LAYOUTS.includes(parsed.l as StepLayout)
        ? (parsed.l as StepLayout)
        : 'standard';

    const result: QuestStep = {
      title: parsed.t,
      message: parsed.m,
      theme,
      icon,
      layout,
    };

    if (typeof parsed.b === 'string' && parsed.b.trim().length > 0) {
      result.stepBadge = parsed.b.trim();
    }

    if (typeof parsed.h === 'string' && parsed.h.trim().length > 0) {
      result.secretHint = parsed.h.trim();
    }

    if (layout === 'codeLock' && typeof parsed.u === 'string' && parsed.u.trim().length > 0) {
      result.unlockCode = parsed.u.trim();
    }

    return result;
  } catch (err) {
    console.error('Failed to decode quest step:', err);
    return null;
  }
}

/**
 * Builds the full viewer URL for a given compressed payload.
 */
export function buildViewerUrl(compressedPayload: string): string {
  const base = window.location.href.split('#')[0];
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}#/v/${compressedPayload}`;
}
