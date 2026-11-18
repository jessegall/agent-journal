<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * What a prune did: how many publications it retired, and each staged folder it kept because a file in it changed.
 */
final readonly class PrunedPublications
{
    /**
     * @param  list<string>  $conflicts  the safe reason for each folder kept
     */
    public function __construct(
        public int $retired,
        public array $conflicts,
    ) {}
}
