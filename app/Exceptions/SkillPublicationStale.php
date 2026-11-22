<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A worker whose fencing version is older than the publication's: a newer worker owns it, so this one stops and
 * reports superseded.
 */
final class SkillPublicationStale extends RuntimeException implements CodedRefusal
{
    public static function for(int $fence, int $current): self
    {
        return new self(
            "This worker holds fence {$fence}, but the publication is at fence {$current}; a newer worker owns it.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
