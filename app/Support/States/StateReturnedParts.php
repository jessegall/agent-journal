<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Exceptions\StateAnswerRefused;
use Traversable;

/**
 * What a state's method returned, read as its parts: nothing, one value returned straight, or each value it yielded.
 * An array is refused: a state returns a command or an event, or yields several.
 */
final class StateReturnedParts
{
    /**
     * @return list<mixed>
     *
     * @throws StateAnswerRefused when the method returned an array
     */
    public static function of(mixed $returned, string $method): array
    {
        return match (true) {
            $returned === null => [],
            is_array($returned) => throw StateAnswerRefused::anArray($method),
            $returned instanceof Traversable => iterator_to_array($returned, false),
            default => [$returned],
        };
    }
}
