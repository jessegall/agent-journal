<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\DomainAvailability;
use App\Contracts\UiOwnerAvailability as UiOwnerAvailabilityContract;
use App\Declarations\DomainUi;

/**
 * Whether the owner of a page, section or navigation item is available now: a listed domain asks its availability
 * for this request; Web's own pages and a module outside the domain list have no switch, so they always are.
 */
final readonly class UiOwnerAvailability implements UiOwnerAvailabilityContract
{
    public function __construct(private DomainRegistry $domains, private DomainAvailability $availability) {}

    public function isAvailable(DomainUi $owner): bool
    {
        return ! $this->domains->has($owner->name) || $this->availability->isEnabled($owner->name);
    }
}
