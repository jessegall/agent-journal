<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\ProgramEvidence;
use RuntimeException;

/**
 * A pinned program's way of sharing an account's sign-in is not shown on the real program, so no launch uses it.
 */
final class ProgramArrangementUnproven extends RuntimeException
{
    public static function for(
        string $program,
        string $version,
        AuthenticationArrangement $arrangement,
        ProgramEvidence $evidence,
        string $owner,
    ): self {
        return new self(
            "{$program} {$version} launches on an account as {$arrangement->value}, which is {$evidence->value}; "
            ."{$owner} shows it on the real program before an agent may launch this way.",
        );
    }
}
