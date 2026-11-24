<?php

declare(strict_types=1);

namespace Tests\Fixtures\TraitRequirements;

/**
 * What a class that uses the greeting trait must implement.
 */
interface Greets
{
    public function greeting(): string;
}
