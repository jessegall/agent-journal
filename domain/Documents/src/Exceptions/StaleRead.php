<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A continued read of a record that has a newer revision than the read began on.
 */
final class StaleRead extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function revision(int $expectedRevision, int $currentRevision): self
    {
        return new self(
            "The record is at revision {$currentRevision} now, not {$expectedRevision}; read it again from the start.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
