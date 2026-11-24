<?php

declare(strict_types=1);

namespace Tests\Fixtures\TraitRequirements;

/**
 * Uses the greeting trait and implements what it needs.
 */
final class PoliteGreeter implements Greets
{
    use SaysHello;

    public function greeting(): string
    {
        return $this->hello();
    }
}
