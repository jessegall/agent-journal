<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A stored settings document whose structure is broken as a whole, so no single entry can be reset; an operator must
 * look at it. The message names the owner and what is broken, never the stored content.
 */
final class SettingsDocumentInvalid extends RuntimeException
{
    public static function notJson(string $owner, Throwable|null $previous = null): self
    {
        return new self("The settings document of {$owner} is not valid JSON.", previous: $previous);
    }

    public static function tooLarge(string $owner, int $bytes, int $mostBytes): self
    {
        return new self("The settings document of {$owner} has {$bytes} bytes, more than the {$mostBytes} allowed.");
    }

    public static function wrongEnvelope(string $owner): self
    {
        return new self(
            "The settings document of {$owner} is not an object holding exactly a settings list and a toggles list.",
        );
    }

    public static function malformedEntry(string $owner, string $list, int $position): self
    {
        return new self(
            sprintf(
                'Entry %s of the %s list in the settings document of %s is not an object holding exactly a valid key and a value.',
                $position,
                $list,
                $owner,
            ),
        );
    }

    public static function duplicateKey(string $owner, string $list, int $position): self
    {
        return new self(
            sprintf(
                'Entry %s of the %s list in the settings document of %s repeats the key of an earlier entry.',
                $position,
                $list,
                $owner,
            ),
        );
    }
}
