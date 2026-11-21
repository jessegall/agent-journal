<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * Where an area names the policies the journal itself may act on through one of its trusted entries.
 */
interface SystemEntryPolicies
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function allow(string $entry, string $policy): void;
}
