<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use RuntimeException;

/**
 * A start of a driver the contained arrangement cannot keep from its sign-in, whatever the account's sign-in
 * method; nothing is created (doc 61, decision 8).
 */
final class DriverNotContainable extends RuntimeException implements StartRefusal
{
    /**
     * The driver cannot run contained, for the reason its capabilities give.
     */
    public static function because(string $reason): self
    {
        return new self($reason);
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::AccountContainerUnsupported;
    }
}
