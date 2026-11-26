<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use Domain\Documents\DocumentsDomain;
use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase as BaseTestCase;

/**
 * The base of every test of Sharing, so what all of them share has one place.
 */
abstract class SharingTestCase extends BaseTestCase
{
    /**
     * Sharing, and the Documents and Plans whose records its tests share.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, PlansDomain::class);
    }
}
