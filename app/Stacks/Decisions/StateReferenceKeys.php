<?php

declare(strict_types=1);

namespace App\Stacks\Decisions;

/**
 * The state type key of a state reference class: the one place a key is read off a class.
 */
final class StateReferenceKeys
{
    /**
     * @param  class-string<StateReferenceFactory>  $reference
     */
    public static function of(string $reference): string
    {
        return $reference::key();
    }
}
