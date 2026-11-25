<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Navigation\ClientOwnerAvailability as ClientOwnerAvailabilityContract;
use App\Declarations\DomainClient;

/**
 * Whether the owner of a page, section or navigation item is available now: a listed domain asks its availability
 * for this request; Web's own pages and a module outside the domain list have no switch, so they always are.
 */
final readonly class ClientOwnerAvailability implements ClientOwnerAvailabilityContract
{
    public function __construct(private DomainRegistry $domains, private DomainAvailability $availability) {}

    public function isAvailable(DomainClient $owner): bool
    {
        return ! $this->domains->has($owner->name) || $this->availability->isEnabled($owner->name);
    }
}
