<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Bus\Contracts\CommandBus;
use App\Contracts\DomainAvailability;
use App\Domains\Exceptions\DomainNotFound;
use App\Domains\Support\DomainStatus;
use App\Domains\Support\SettingsDomainAvailability;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Settings\Values\GroupReference;
use Tests\Support\ActsAsActors;
use Tests\Support\ActsAsTestOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\CountsReads;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A domain is available while its switch is on and every domain it requires is available, worked out from one read
 * of Core's settings; switching a requirement off never rewrites the dependent domain's own switch.
 */
final class DomainAvailabilityTest extends TestCase
{
    use ActsAsActors;
    use ActsAsTestOwner;
    use CommitsHookRows;
    use CountsReads;

    /**
     * The bus commits the switch commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private int $revision = 0;

    public function test_switching_tasks_off_makes_plans_unavailable_while_its_own_switch_stays_on_and_back(): void
    {
        $this->assertTrue($this->availability()->isEnabled('Plans'));

        $this->switchOff('domain_tasks');
        $plans = $this->domainStatus('Plans');
        $this->assertSame(
            [true, false, ['Tasks']],
            [$plans->switchedOn, $plans->available, $plans->unavailableRequirements],
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
        $this->assertSame([false, false, []], [$plans->switchedOn, $plans->available, $plans->unavailableRequirements]);
        $this->assertTrue($this->availability()->isEnabled('Tasks'));
    }

    public function test_access_and_core_are_always_available(): void
    {
        $this->switchOff('domain_tasks');

        $this->assertTrue($this->availability()->isEnabled('Access'));
        $this->assertTrue($this->availability()->isEnabled('Core'));
    }

    public function test_one_answer_reads_core_settings_once(): void
    {
        $availability = $this->availability();

        $this->assertSame(1, $this->readCounts(fn () => $availability->isEnabled('Plans'))->queriesRun);
    }

    public function test_a_corrupt_switch_is_an_error_never_a_guess(): void
    {
        SettingsRecord::makeEmptyFor('Core');
        $record = SettingsRecord::sharedRuntimeForOwner('Core')->get();
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
            new DisableSettingGroup(new GroupReference('Core', $key), $this->revision++),
        );
    }

    private function switchOn(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new EnableSettingGroup(new GroupReference('Core', $key), $this->revision++),
        );
    }

    /**
     * The availability of a new request, reading the settings as they are now.
     */
    private function availability(): SettingsDomainAvailability
    {
        $this->app->forgetScopedInstances();
        $this->actAs(TestActors::user(7));
        $availability = $this->app->make(DomainAvailability::class);
        $this->assertInstanceOf(SettingsDomainAvailability::class, $availability);

        return $availability;
    }

    private function domainStatus(string $owner): DomainStatus
    {
        return $this->availability()->status($owner);
    }
}
