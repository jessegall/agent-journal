<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Domains\Support\DomainRegistry;
use Tests\Support\AffectedTests;
use Tests\TestCase;

/**
 * Picking the tests a change can break from the domain boundaries.
 */
final class AffectedTestsTest extends TestCase
{
    public function test_a_private_change_inside_one_domain_runs_only_that_domain(): void
    {
        $this->assertSame(['tests/Architecture', 'domain/Tasks/tests'], $this->affectedBy('domain/Tasks/src/Support/TaskTitles.php'));
    }

    public function test_a_change_to_an_export_also_runs_every_domain_that_requires_it(): void
    {
        $this->assertSame(['tests/Architecture', 'domain/Plans/tests', 'domain/Tasks/tests'], $this->affectedBy('domain/Tasks/src/Contracts/TaskReader.php'));
    }

    public function test_a_change_to_a_domains_own_tests_runs_only_those(): void
    {
        $this->assertSame(['tests/Architecture', 'domain/Rules/tests'], $this->affectedBy('domain/Rules/tests/Feature/ReviewRuleTest.php'));
    }

    public function test_a_change_outside_every_domain_runs_everything(): void
    {
        $this->assertSame(AffectedTests::EVERYTHING, $this->affectedBy('domain/Rules/src/Handlers/ApproveRuleHandler.php', 'app/Bus/Support/CommandRegistry.php'));
    }

    /**
     * @return list<string>
     */
    private function affectedBy(string ...$files): array
    {
        return new AffectedTests($this->app->make(DomainRegistry::class), base_path())->for(array_values($files));
    }
}
