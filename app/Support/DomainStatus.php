<?php

declare(strict_types=1);

namespace App\Support;

/**
 * One owner's switch as the owner set it and whether the owner is available because of it and its requirements;
 * the switch alone is never the availability.
 */
final readonly class DomainStatus
{
    /**
     * @param  list<string>  $unavailableRequirements  the required domains that are not available, by name
     */
    public function __construct(
        public string $owner,
        public bool $switchedOn,
        public bool $available,
        public array $unavailableRequirements,
    ) {}
}
