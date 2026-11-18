<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Contracts\DomainAvailability;
use App\Domains\Support\DomainRegistry;
use App\Ui\Declarations\DomainUi;
use Illuminate\Contracts\Container\Container;

/**
 * Whether the owner of a page, section or navigation item is available now: a listed domain asks its availability
 * for this request; Web's own pages and a module outside the domain list have no switch, so they always are.
 */
final readonly class UiOwnerAvailability
{
    public function __construct(private DomainRegistry $domains, private Container $container) {}

    public function isAvailable(DomainUi $owner): bool
    {
        return ! $this->domains->has($owner->name) || $this->container->make(DomainAvailability::class)->isEnabled($owner->name);
    }
}
