<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\StepType;
use RuntimeException;

/**
 * The supervisor will not run a plan: a builtin uses a form it does not support, found before any child starts, or a
 * step type it does not run yet.
 */
final class SupervisorRefused extends RuntimeException
{
    public static function unsupportedBuiltin(string $name, string $reason): self
    {
        return new self("The builtin {$name} is not run in this form: {$reason}.");
    }

    public static function stepNotRun(StepType $type): self
    {
        return new self("A {$type->value} step is not run by the supervisor yet.");
    }

    public static function unsupportedRedirect(string $type): self
    {
        return new self("The redirect {$type} is not run by the supervisor.");
    }
}
