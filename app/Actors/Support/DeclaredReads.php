<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Exceptions\ReadEntitlementMissing;
use App\Actors\Values\ReadEntitlement;
use App\Registries\Support\Registry;

/**
 * Every read's entitlement, registered once at boot by the module that owns the read. A read nobody declared keeps
 * only its own resolver's checks, as every signed read did before reads declared entitlements.
 */
final class DeclaredReads implements ReadEntitlements
{
    /**
     * @var Registry<ReadEntitlement>
     */
    private readonly Registry $reads;

    public function __construct()
    {
        $this->reads = Registry::replacing(ReadEntitlementMissing::for(...));
    }

    public function declare(string $name, ReadEntitlement $entitlement): void
    {
        $this->reads->put($name, $entitlement);
    }

    public function of(string $name): ReadEntitlement
    {
        return $this->reads->find($name)->getOrElse(ReadEntitlement::resolver());
    }
}
