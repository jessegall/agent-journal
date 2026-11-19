<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class IncomingWorkRepeated extends LogicException
{
    public static function forWork(string $workClass): self
    {
        return new self("The incoming work {$workClass} is registered twice; register it once.");
    }
}
