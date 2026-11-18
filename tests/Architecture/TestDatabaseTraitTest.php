<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\TestDatabaseTraits;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every test reaches its database through Tests\Support\RefreshHookDatabase, never through Laravel's database traits.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class TestDatabaseTraitTest extends TestCase
{
    public function test_a_test_case_using_a_laravel_database_trait_is_named(): void
    {
        $this->assertSame(
            [base_path('tests/Fixtures/TestDatabaseTraits/RefreshingCase.php')],
            TestDatabaseTraits::offendersIn([base_path('tests/Fixtures/TestDatabaseTraits')], []),
        );
    }

    public function test_no_test_uses_a_laravel_database_trait(): void
    {
        $offenders = TestDatabaseTraits::offendersIn(
            [base_path('tests')],
            [base_path('tests/Fixtures'), base_path('tests/Support/RefreshHookDatabase.php')],
        );

        $this->assertSame([], $offenders, 'These test files use a Laravel database trait; use Tests\Support\RefreshHookDatabase instead.');
    }
}
