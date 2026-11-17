<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use InvalidArgumentException;

final class StateTypeUnknown extends InvalidArgumentException
{
    public static function forKey(string $typeKey): self
    {
        return new self("No state type is registered under {$typeKey}.");
    }
}
