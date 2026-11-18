<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * An agent created without a name, or with only blank text.
 */
final class AgentNameRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forAgent(): self
    {
        return new self('Name the agent: a blank name is refused.');
    }
}
