<?php

declare(strict_types=1);

namespace Tests\Fixtures\Search;

use App\Contracts\DomainAvailability;

/**
 * Domain availability where every owner runs except the ones switched off.
 */
final readonly class SwitchedOffDomains implements DomainAvailability
{
    /**
     * @param  list<string>  $switchedOff
     */
    public function __construct(private array $switchedOff = []) {}

    public function isEnabled(string $owner): bool
    {
        return ! in_array($owner, $this->switchedOff, true);
    }
}
