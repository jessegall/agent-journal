<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\States\ReadyStateType;
use UnexpectedValueException;

/**
 * A stored stack whose bottom is missing, not first, repeated or of another role than the agent was launched with.
 */
final class InvalidBottomState extends UnexpectedValueException
{
    public static function missing(): self
    {
        return new self('The stored stack has no bottom state as its first frame.');
    }

    public static function repeated(string $frameId): self
    {
        return new self("The stored stack has a second bottom state in frame {$frameId}.");
    }

    public static function ofAnotherRole(string $typeKey, ReadyStateType $role): self
    {
        return new self("The stored stack's bottom state is {$typeKey}, but the agent runs as {$role->value}.");
    }
}
