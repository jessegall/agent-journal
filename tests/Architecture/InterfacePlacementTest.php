<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\InterfacePlacement;
use Tests\TestCase;

/**
 * Rule 17: every interface of a domain or the core lives in a Contracts folder of the area that uses it.
 */
final class InterfacePlacementTest extends TestCase
{
    public function test_an_interface_outside_a_contracts_folder_is_named_and_one_inside_passes(): void
    {
        $this->assertSame(['Tests\\Fixtures\\Interfaces\\Loose\\PaysOrders'], InterfacePlacement::misplacedIn([base_path('tests/Fixtures/Interfaces')]));
    }

    public function test_every_interface_of_the_domains_and_the_core_lies_in_a_contracts_folder(): void
    {
        $this->assertSame([], InterfacePlacement::misplacedIn([app_path(), ...DomainFiles::domainCode()]));
    }
}
