<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Exceptions;

use LogicException;

/**
 * Thrown by a generated arrangement the generator could not complete: it names the entry and what is still to fill in,
 * so the suite fails until the call is arranged by hand.
 */
final class EntryTestNeedsArrangement extends LogicException
{
    /**
     * @param  list<string>  $missing
     */
    private function __construct(public readonly string $entry, public readonly array $missing)
    {
        parent::__construct("Arrange the test of {$entry}: fill in ".implode(', ', $missing).'.');
    }

    /**
     * @param  list<string>  $missing  such as a route parameter, the payload or the expected commands
     */
    public static function for(string $entry, array $missing): self
    {
        return new self($entry, $missing);
    }
}
