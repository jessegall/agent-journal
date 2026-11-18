<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use InvalidArgumentException;

final class EmptyReason extends InvalidArgumentException
{
    public static function forDecision(): self
    {
        return new self('A decision that denies a hook or holds a stop needs a reason the agent can read.');
    }
}
