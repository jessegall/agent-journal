<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

/**
 * A text for an agent was asked for by a key no language file registers.
 */
final class AgentTextUnknown extends LogicException
{
    public static function forKey(string $key): self
    {
        return new self("No agent text is registered under {$key}.");
    }
}
