<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ThrowOnlyGuards;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 47: a method whose only purpose is to throw when something does not hold is named assert<What>, never
 * require, ensure, check, guard or refuse.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class ThrowOnlyGuardTest extends TestCase
{
    public function test_a_throw_only_require_is_found_and_an_assert_and_an_answering_check_pass(): void
    {
        $this->assertSame(
            ['Tests\\Fixtures\\ThrowOnlyGuards\\Gate::requireStarted'],
            $this->guardsIn([base_path('tests/Fixtures/ThrowOnlyGuards')]),
        );
    }

    public function test_no_throw_only_method_of_the_core_or_the_domains_is_named_as_a_guard(): void
    {
        $folders = [app_path(), ...DomainFiles::domainCode(), base_path('tests/Support')];

        $this->assertSame([], $this->guardsIn($folders));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function guardsIn(array $folders): array
    {
        $found = ScanCache::findings(new ThrowOnlyGuards(), DomainFiles::in($folders));
        sort($found);

        return $found;
    }
}
