<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class IncomingWorkRepeated extends LogicException
{
    public static function forWork(string $class): self
    {
        return new self("The incoming work {$class} is registered twice; register it once.");
    }
}
