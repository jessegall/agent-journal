<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Tests\Support\Exceptions\DomainNotBooted;
use Tests\TestCase;

/**
 * A core test boots no domain, so a class of a domain it reaches by a name built at run time refuses to load, while
 * a domain's own tests folder stays open.
 */
final class DomainLoadGuardTest extends TestCase
{
    public function test_a_class_of_a_domain_the_test_did_not_boot_refuses_to_load(): void
    {
        $this->expectException(DomainNotBooted::class);

        class_exists('Domain\\Sharing\\'.'NotBootedHere');
    }

    public function test_a_domains_own_tests_folder_still_loads(): void
    {
        $this->assertFalse(class_exists('Domain\\Sharing\\Tests\\'.'NotBootedHere'));
    }
}
