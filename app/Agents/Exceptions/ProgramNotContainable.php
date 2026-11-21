<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start of a program the contained arrangement cannot keep from its sign-in, whatever the account's sign-in
 * method; nothing is created (doc 61, decision 8).
 */
final class ProgramNotContainable extends RuntimeException implements CommandRefusal
{
    public static function codex(): self
    {
        return new self(
            "Codex's sandbox does not keep tools from its sign-in; container starts wait for the provider transport",
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::AccountContainerUnsupported;
    }
}
