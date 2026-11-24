<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\ArrangementType;
use App\Support\ArrangementSetting;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\Compatibility\Exceptions\DriverArrangementUnproven;
use App\Support\Compatibility\Exceptions\DriverUnstartableInContainer;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * Contained, a driver's arrangement is shown only by a contained host's report that every item is enforced in the
 * agent image; until then a start is refused naming what is missing.
 */
final class ContainedProgramEvidenceTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string NO_CLAUDE_REPORT = 'no contained host has reported the protection of claude-code 2.1.323';

    private const string UNENFORCED = "the agent image's protection report leaves "
        .'account-secrets, process-inspection unenforced (%s)';

    private const string CODEX_SHORTFALL = 'no contained host has reported the protection of codex 0.165.0 '
        .'in the agent image for linux-container (journal-agent protection --arrangement=contained)';

    private const string PROTECTED_SHORTFALL = 'no contained host has reported the protection of claude-code 2.1.323 '
        .'in the agent image for linux-container-protected';

    private const array ITEMS = [
        'account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes',
    ];

    public function test_the_local_arrangement_answers_the_pinned_compatibility_as_before(): void
    {
        $this->assertEquals(
            DriverCompatibility::pinned(DefaultDrivers::CLAUDE_CODE),
            $this->compatibility(DefaultDrivers::CLAUDE_CODE),
        );
    }

    public function test_with_no_report_a_contained_start_is_refused_naming_the_missing_report(): void
    {
        $this->useArrangement(ArrangementType::Contained);

        $this->expectException(DriverArrangementUnproven::class);
        $this->expectExceptionMessage(self::NO_CLAUDE_REPORT);

        $this->compatibility(DefaultDrivers::CLAUDE_CODE)->assertStartable();
    }

    public function test_a_report_with_unenforced_items_refuses_naming_them_and_why(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $reason = "no native mechanism: Claude Code's sandbox does not start in the agent container: bwrap: no proc";
        $items = $this->items(['account-secrets', 'process-inspection'], $reason);
        $this->notify($this->containedHost(), 'claude-code', '2.1.323', $items)->assertNoContent();

        $this->assertThrows(
            fn () => $this->compatibility(DefaultDrivers::CLAUDE_CODE)->assertStartable(),
            DriverUnstartableInContainer::class,
            DriverUnstartableInContainer::for('claude-code', '2.1.323', sprintf(self::UNENFORCED, $reason))
                ->getMessage(),
        );
        $this->assertThrows(
            fn () => $this->compatibility(DefaultDrivers::CODEX)->assertStartable(),
            DriverArrangementUnproven::class,
            DriverArrangementUnproven::inContainer('codex', '0.165.0', self::CODEX_SHORTFALL)->getMessage(),
        );
    }

    public function test_a_report_with_every_item_enforced_admits_a_contained_start(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $host = $this->containedHost();
        $this->notify($host, 'claude-code', '2.1.323', $this->items(['keychain'], 'missing'))->assertNoContent();
        $this->notify($host, 'claude-code', '2.1.323', $this->items([], ''))->assertNoContent();

        $this->compatibility(DefaultDrivers::CLAUDE_CODE)->assertStartable();

        $this->assertFalse($this->compatibility(DefaultDrivers::CODEX)->arrangementEvidence->isNativeShown());
    }

    public function test_a_driver_whose_signed_in_starts_run_protected_is_admitted_by_its_protected_report_only(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        config(['agents.protected_account_trial' => 'claude-code']);
        $host = $this->containedHost();
        $reason = "no native mechanism: Claude Code's sandbox does not start in the agent container: bwrap: no proc";
        $this->notify($host, 'claude-code', '2.1.323', $this->items(self::ITEMS, $reason))->assertNoContent();

        $this->assertThrows(
            fn () => $this->compatibility(DefaultDrivers::CLAUDE_CODE)->assertStartable(),
            DriverArrangementUnproven::class,
            self::PROTECTED_SHORTFALL,
        );

        $this->notify($host, 'claude-code', '2.1.323', $this->items([], ''), 'linux-container-protected')
            ->assertNoContent();

        $this->compatibility(DefaultDrivers::CLAUDE_CODE)->assertStartable();
    }

    private function compatibility(string $driver): DriverCompatibility
    {
        return $this->app->make(DriverCompatibilities::class)->for($driver);
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig($arrangement->value, 'journal', '{}'));
    }

    private function containedHost(): EnrolledHost
    {
        $name = 'contained host '.Str::random(6);

        return $this->asSystem(new EnrollHostCommand($name, ['/workspace'], ArrangementType::Contained));
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function notify(
        EnrolledHost $host,
        string $driver,
        string $build,
        array $items,
        string $platform = 'linux-container',
    ): TestResponse {
        return $this->hostCall($host, '/host/reports/protection', [
            'driver' => $driver,
            'build' => $build,
            'platform' => $platform,
            'items' => $items,
        ]);
    }

    /**
     * Every item enforced with evidence, but those named, which give the reason; each item carries both keys, the
     * unused one empty, as journal-agent sends them (client.ProtectionItem).
     *
     * @param  list<string>  $unenforced
     * @return list<array<string, mixed>>
     */
    private function items(array $unenforced, string $reason): array
    {
        return array_map(
            fn (string $item): array => in_array($item, $unenforced, true)
                ? ['item' => $item, 'enforced' => false, 'evidence' => '', 'reason' => $reason]
                : ['item' => $item, 'enforced' => true, 'evidence' => 'run-1', 'reason' => ''],
            self::ITEMS,
        );
    }
}
