<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Values\StepOutcome;

/**
 * What reading one member of a script object gave: its value, or, when it could not be read, the step outcome that
 * says why: pending on a read the host has not answered yet, or failed with a diagnostic. A failed read is never a
 * value such as false.
 */
final readonly class ObjectRead
{
    private function __construct(public bool|int|string|null $value, public StepOutcome|null $unread) {}

    public static function value(bool|int|string $value): self
    {
        return new self($value, null);
    }

    public static function pending(string $reference): self
    {
        return new self(null, StepOutcome::pending($reference));
    }

    public static function failed(string $diagnostic): self
    {
        return new self(null, StepOutcome::failed($diagnostic));
    }
}
