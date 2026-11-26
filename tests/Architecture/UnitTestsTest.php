<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\UnitTestDatabaseTraits;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A unit test runs without the database: no class of tests/Unit or of a domain's tests/Unit uses RefreshHookDatabase
 * or CommitsHookRows, and a fixture that does is listed by name.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every unit test file.')]
final class UnitTestsTest extends TestCase
{
    public function test_no_unit_test_uses_a_database_trait(): void
    {
        $this->assertSame([], new UnitTestDatabaseTraits(base_path())->users());
    }

    public function test_a_unit_test_with_a_database_trait_is_listed(): void
    {
        $this->assertSame(
            [
                'tests/Unit/DatabaseUnitTest.php uses RefreshHookDatabase: a unit test runs without the database, so '
                    .'move it to its entry test or to tests/Machinery.',
            ],
            new UnitTestDatabaseTraits(base_path('tests/Fixtures/UnitTests'))->users(),
        );
    }
}
