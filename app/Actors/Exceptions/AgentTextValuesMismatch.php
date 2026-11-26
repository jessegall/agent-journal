<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

/**
 * A text for an agent was given values that do not match the placeholders its registered text declares.
 */
final class AgentTextValuesMismatch extends LogicException
{
    /**
     * @param  list<string>  $declared
     * @param  list<int|string>  $given
     */
    public static function forKey(string $key, array $declared, array $given): self
    {
        $expected = implode(', ', $declared);
        $received = implode(', ', $given);

        return new self("The agent text {$key} declares [{$expected}] but was given [{$received}].");
    }
}
