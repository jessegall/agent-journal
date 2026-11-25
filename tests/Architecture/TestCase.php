<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\DomainRegistry;
use Tests\TestCase as BaseTestCase;

/**
 * The base of an architecture test that checks the whole project, so it boots every installed domain: their commands,
 * policies, listeners and morph types are all part of what it judges.
 */
abstract class TestCase extends BaseTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 2));
    }
}
