<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Relay;

/**
 * The native hook event a raw payload names, read without trusting anything else in it.
 */
final class NativeEventName
{
    public static function of(string $payload): string
    {
        $decoded = json_decode($payload, true);

        return is_array($decoded) && is_string($decoded['hook_event_name'] ?? null) ? $decoded['hook_event_name'] : 'unknown';
    }
}
