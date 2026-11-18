<?php

declare(strict_types=1);

namespace App\Processes\Stages\Grammar;

/**
 * A word's substitutions read into their owner.
 */
final readonly class SubstitutionsRead
{
    public function __construct(public int $owner) {}
}
