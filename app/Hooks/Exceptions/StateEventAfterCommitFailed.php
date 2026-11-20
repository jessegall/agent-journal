<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Hooks\Enums\StateEventStage;
use RuntimeException;
use Throwable;

final class StateEventAfterCommitFailed extends RuntimeException
{
    public static function during(string $event, StateEventStage $stage, Throwable $failure): self
    {
        return new self(
            "After-commit state delivery of {$event} failed during {$stage->value}.",
            previous: $failure,
        );
    }
}
