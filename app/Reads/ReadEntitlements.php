<?php

declare(strict_types=1);

namespace App\Reads;

use App\Access\Contracts\ReadEntitlements as ReadEntitlementsContract;
use App\Access\Values\ReadEntitlement;
use App\Reads\Exceptions\ReadEntitlementMissing;
use App\Support\Registry;

/**
 * Every read's entitlement, registered once at boot by the module that owns the read. A read nobody declared keeps
 * only its own resolver's checks, as every signed read did before reads declared entitlements.
 */
final class ReadEntitlements implements ReadEntitlementsContract
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
