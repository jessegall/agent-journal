<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Support\AutoAssignmentKey;
use RuntimeException;

/**
 * A change of an auto-assignment that was never enabled; it is enabled first.
 */
final class AutoAssignmentMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forKey(AutoAssignmentKey $key): self
    {
        $actor = $key->actor;

        return new self(
            "The {$actor->type} {$actor->id} has no auto-assignment of {$key->assignableType}; enable it first.",
        );
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
