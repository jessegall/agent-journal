<?php

declare(strict_types=1);

namespace Domain\Rules\Tests;

use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase as BaseTestCase;

/**
 * The base of every test of the Rules domain, so what all of them share has one place.
 */
abstract class TestCase extends BaseTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }
}
