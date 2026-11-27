<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Sessions\States\Support\ReadyStateReference;
use App\Stacks\Decisions\StateReferenceKeys;
use UnexpectedValueException;

/**
 * A stored stack whose bottom is missing, not first, repeated or of another type than the one ready state.
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

    public static function ofAnotherType(string $typeKey): self
    {
        $expected = StateReferenceKeys::of(ReadyStateReference::class);

        return new self("The stored stack's bottom state is {$typeKey}, but every stack's bottom is {$expected}.");
    }
}
