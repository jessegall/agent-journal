<?php

declare(strict_types=1);

namespace App\Support\Relay;

use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * The native hook event a raw payload names, read without trusting anything else in it.
 */
final class DriverEventName
{
    public static function of(string $hookJson): string
    {
        try {
            return NamedHookEvent::from(json_decode($hookJson, true, 512, JSON_THROW_ON_ERROR))->hookEventName;
        } catch (JsonException|CannotCreateData|TypeError) {
            return 'unknown';
        }
    }
}
