<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Support\DomainRegistry;
use Tests\Support\AffectedTests;
use Tests\TestCase;

/**
 * Picking the tests a change can break from the domain boundaries.
 */
final class AffectedTestsTest extends TestCase
{
    public function test_a_private_change_inside_one_domain_runs_only_that_domain(): void
    {
        $this->assertSame(
            ['tests/Architecture', 'domain/Tasks/tests'],
            $this->affectedBy('domain/Tasks/src/Support/TaskTitles.php'),
        );
    }

    public function test_a_change_to_an_export_also_runs_every_domain_that_requires_it(): void
    {
        $this->assertSame(
            ['tests/Architecture', 'domain/Plans/tests', 'domain/Tasks/tests'],
            $this->affectedBy('domain/Tasks/src/Contracts/TaskResolver.php'),
        );
    }

    public function test_a_change_to_a_domains_own_tests_runs_only_those(): void
    {
        $this->assertSame(
            ['tests/Architecture', 'domain/Rules/tests'],
            $this->affectedBy('domain/Rules/tests/Feature/ReviewRuleTest.php'),
        );
    }

    public function test_a_change_to_an_area_everything_stands_on_or_the_test_support_runs_everything(): void
    {
        $this->assertSame(
            AffectedTests::EVERYTHING,
            $this->affectedBy(
                'domain/Rules/src/Commands/ApproveRule/ApproveRuleHandler.php',
                'app/Support/CommandRegistry.php',
            ),
        );
        $this->assertSame(AffectedTests::EVERYTHING, $this->affectedBy('tests/Support/CommitsHookRows.php'));
        $this->assertSame(AffectedTests::EVERYTHING, $this->affectedBy('config/accounts.php'));
    }

    public function test_a_change_to_a_core_area_runs_its_tests_and_the_tests_that_name_the_class(): void
    {
        $affected = $this->affectedBy('app/Support/ClaudeKeySignIn.php');

        $this->assertNotSame(AffectedTests::EVERYTHING, $affected);
        $this->assertContains('tests/Feature/Profiles', $affected);
        $this->assertContains('tests/Architecture', $affected);
        $this->assertNotContains('tests/Feature/Bus', $affected);
    }

    public function test_a_changed_test_file_runs_itself(): void
    {
        $affected = $this->affectedBy('tests/Feature/Profiles/SignInSecretTest.php');

        $this->assertSame(['tests/Architecture', 'tests/Feature/Profiles/SignInSecretTest.php'], $affected);
    }

    public function test_a_test_file_inside_a_selected_folder_is_not_listed_again(): void
    {
        $affected = $this->affectedBy('app/Models/NotificationReceipt.php');

        $this->assertContains('tests/Feature/Communication', $affected);
        $this->assertNotContains('tests/Feature/Communication/NotificationFeedTest.php', $affected);
    }

    /**
     * @return list<string>
     */
    private function affectedBy(string ...$files): array
    {
        return new AffectedTests($this->app->make(DomainRegistry::class), base_path())->for(array_values($files));
    }
}
