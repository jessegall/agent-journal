<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Domains\DomainAvailability as DomainAvailabilityContract;
use App\Exceptions\DomainNotFound;
use App\Exceptions\SettingStorageInvalid;
use App\Models\Records\SettingsRecord;
use App\Support\DomainAvailability;
use App\Support\DomainRegistry;
use App\Support\DomainStatus;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\EncodedValue;
use App\Values\GroupReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\CountsReads;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A domain is available while its switch is on and every domain it requires is available, worked out from one read
 * of Core's settings; switching a requirement off never rewrites the dependent domain's own switch.
 */
final class DomainAvailabilityTest extends TestCase
{
    use CommitsHookRows;
    use CountsReads;

    /**
     * Every installed domain, since this test reads the switches, pages and settings of the domains as a whole.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    /**
     * The bus commits the switch commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private int $revision = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_switching_tasks_off_makes_plans_unavailable_while_its_own_switch_stays_on_and_back(): void
    {
        $this->assertTrue($this->availability()->isEnabled('Plans'));

        $this->switchOff('domain_tasks');
        $plans = $this->domainStatus('Plans');

        $this->assertSame(
            [true, false, ['Tasks']],
            [$plans->isSwitchedOn, $plans->isAvailable, $plans->unavailableRequirements],
        );

        $this->switchOn('domain_tasks');
        $this->assertTrue($this->availability()->isEnabled('Plans'));
    }

    public function test_plans_switched_off_stays_unavailable_after_tasks_returns(): void
    {
        $this->switchOff('domain_tasks');
        $this->switchOff('domain_plans');
        $this->switchOn('domain_tasks');

        $plans = $this->domainStatus('Plans');
        $this->assertSame([false, false, []], [$plans->isSwitchedOn, $plans->isAvailable, $plans->unavailableRequirements]);
        $this->assertTrue($this->availability()->isEnabled('Tasks'));
    }

    public function test_core_is_always_available(): void
    {
        $this->switchOff('domain_tasks');

        $this->assertTrue($this->availability()->isEnabled('Core'));
    }

    public function test_one_answer_reads_core_settings_once(): void
    {
        $availability = $this->availability();

        $this->assertSame(1, $this->readCounts(fn () => $availability->isEnabled('Plans'))->queriesRun);
    }

    public function test_a_corrupt_switch_is_an_error_never_a_guess(): void
    {
        SettingsRecord::create('Core');
        $record = SettingsRecord::findSharedRuntimeForOwner('Core')->get();
        $record->revise($record->document->withToggle(new EncodedToggle('domain_tasks', EncodedValue::of('off'))));

        $this->expectException(SettingStorageInvalid::class);

        $this->availability()->isEnabled('Plans');
    }

    public function test_an_unknown_owner_is_an_error(): void
    {
        $this->expectException(DomainNotFound::class);

        $this->availability()->isEnabled('Nobody');
    }

    private function switchOff(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }

    private function switchOn(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new EnableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }

    /**
     * The availability of a new request, reading the settings as they are now.
     */
    private function availability(): DomainAvailability
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId(TestIds::of(7));
        $availability = $this->app->make(DomainAvailabilityContract::class);
        $this->assertInstanceOf(DomainAvailability::class, $availability);

        return $availability;
    }

    private function domainStatus(string $owner): DomainStatus
    {
        return $this->availability()->status($owner);
    }
}
