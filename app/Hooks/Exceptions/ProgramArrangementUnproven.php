<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\ProgramEvidence;
use RuntimeException;

/**
 * A pinned program's way of sharing an account's sign-in is not shown on the real program, so no launch uses it.
 */
final class ProgramArrangementUnproven extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

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

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
