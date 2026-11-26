<?php

declare(strict_types=1);

namespace App\Engine\Exceptions;

use LogicException;

final class FrameBaselineMissing extends LogicException
{
    public static function forFrame(string $frameId): self
    {
        return new self("The frame {$frameId} has no settled tick in this engine process.");
    }
}
