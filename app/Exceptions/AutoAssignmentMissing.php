<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
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
            "The {$actor->type->value} {$actor->id} has no auto-assignment of {$key->assignableType}; enable it first.",
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
