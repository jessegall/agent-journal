<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;
use Throwable;

/**
 * A proposed profile configuration that cannot be read as one: a value of the wrong shape, a class rule that is not
 * access:area, or a feature field this version does not support.
 */
final class ProfileProposalRefused extends InvalidArgumentException implements CommandRefusal
{
    public static function unreadable(Throwable $failure): self
    {
        return new self("The profile proposal cannot be read: {$failure->getMessage()}", 0, $failure);
    }

    public static function rootRule(string $text, Throwable|null $previous = null): self
    {
        return new self(
            "A root rule is written access:root, such as delete:. for the working folder; {$text} is not.",
            previous: $previous,
        );
    }

    public static function unknownInstances(string $key, string $value): self
    {
        return new self("Profile {$key} names instances {$value}; use single, per_job or reusable.");
    }

    public static function unsupportedField(string $key, string $field): self
    {
        return new self("Profile {$key} sets {$field}, which this version does not support yet.");
    }
}
