<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests;

use Domain\Documents\DocumentsDomain;
use Domain\Plans\PlansDomain;
use Domain\Sharing\SharingDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase as BaseTestCase;

/**
 * The base of every test of the Sharing domain, so what all of them share has one place.
 */
abstract class TestCase extends BaseTestCase
{
    /**
     * Sharing, and the Documents and Plans whose records its tests share.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class, PlansDomain::class);
    }
}
