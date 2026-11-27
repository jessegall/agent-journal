<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\RunEventType;
use RuntimeException;

/**
 * A run event about a part came without the part it is about.
 */
final class RunEventWithoutPart extends RuntimeException
{
    public static function of(RunEventType $type): self
    {
        return new self("A {$type->value} event names no part.");
    }
}
