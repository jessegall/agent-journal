<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use App\Values\ProfileKey;
use RuntimeException;
use Throwable;

final class ProfileDraftRefused extends RuntimeException implements CommandRefusal
{
    public static function stale(ProfileKey $profile, int $expected, int $actual): self
    {
        return new self("Draft {$profile} is at revision {$actual}, but revision {$expected} was requested.");
    }

    public static function invalidCommand(string $key): self
    {
        return new self("The command definition {$key} is invalid.");
    }

    public static function oversized(): self
    {
        return new self('The profile draft is too large.');
    }

    public static function invalidExpectation(string $option): self
    {
        return new self("Expected a draft revision as profile=revision, received {$option}.");
    }

    public static function unreadable(string $path, Throwable|null $cause = null): self
    {
        return new self("The draft file {$path} could not be read.", previous: $cause);
    }
}
