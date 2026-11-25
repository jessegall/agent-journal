<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A draft edit against another version or editor than the draft has now.
 */
final class DraftConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function stale(int $expectedVersion, int $currentVersion): self
    {
        return new self(
            "The draft is at version {$currentVersion}, not {$expectedVersion}; read it again and repeat the edit.",
        );
    }

    public static function ofAnotherActor(): self
    {
        return new self('This draft belongs to another editor or session; open your own draft.');
    }

    public static function withoutVersion(): self
    {
        return new self('Read the draft and send its current version with the edit.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
