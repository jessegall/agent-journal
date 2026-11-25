<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Commands\Settings\SetStringSetting\SetStringSettingCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Domains\DomainAvailability as DomainAvailabilityContract;
use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Settings\SettingsOutcome;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\CoreSettings;
use App\Support\DomainAvailability;
use App\Support\DomainRegistry;
use App\Support\DomainStatus;
use App\Support\SettingRegistry;
use App\Support\Stack\StateTypes;
use App\Values\GroupReference;
use App\Values\OwnerAuthority;
use App\Values\SettingReference;
use App\Values\SettingsChange;
use Tests\Support\CommitsHookRows;
use Tests\Support\CountsReads;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner switches a group off once, its settings kept, and switching it off again changes nothing.
 */
final class DisableSettingGroupTest extends TestCase
{
    use ChangesReviewsSettings;
    use CommitsHookRows;
    use CountsReads;
    use InstallsCommandModules;
    use UsesReviewsSettings;

    private const string JOURNAL_NAME = 'My journal';

    private int $revision = 0;

    /**
     * Every installed domain, since switching a group off reaches the switches, pages and settings of all of them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = [
        'settings_records',
    ];

    public function test_a_group_is_switched_off_once(): void
    {
        $this->assertChange(
            SettingsOutcome::Changed,
            1,
            $this->runCommand($this->commands->disable($this->reviews->review, 0)),
        );
        $this->assertChange(
            SettingsOutcome::Unchanged,
            1,
            $this->runCommand($this->commands->disable($this->reviews->review, 1)),
        );

        $this->app->forgetScopedInstances();
        $this->assertNotInstanceOf(
            EnabledSettingsGroup::class,
            $this->app->make(SettingsResolver::class)->group($this->reviews->review),
        );
    }

    public function test_switching_tasks_off_makes_plans_unavailable_while_its_own_switch_stays_on_and_back(): void
    {
        $this->useSettingsBesideTestModules();
        $this->journal->actAsUserId(TestIds::of(7));

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
        $this->useSettingsBesideTestModules();
        $this->journal->actAsUserId(TestIds::of(7));

        $this->switchOff('domain_tasks');
        $this->switchOff('domain_plans');
        $this->switchOn('domain_tasks');

        $plans = $this->domainStatus('Plans');
        $this->assertSame(
            [false, false, []],
            [$plans->isSwitchedOn, $plans->isAvailable, $plans->unavailableRequirements],
        );
        $this->assertTrue($this->availability()->isEnabled('Tasks'));
    }

    public function test_core_is_always_available(): void
    {
        $this->useSettingsBesideTestModules();
        $this->journal->actAsUserId(TestIds::of(7));

        $this->switchOff('domain_tasks');

        $this->assertTrue($this->availability()->isEnabled('Core'));
    }

    public function test_switching_the_owner_off_switches_its_state_type_off(): void
    {
        $this->useSettingsBesideTestModules();
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
        $working = $this->app->make(StateTypes::class)->registry()->get('tasks.work');
        $this->assertTrue($working->isEnabled());

        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', 'domain_tasks'), 0),
        );

        $this->app->forgetScopedInstances();

        $this->assertFalse($working->isEnabled());
    }

    public function test_core_settings_still_read_and_change_while_a_domain_is_off(): void
    {
        $this->useSettingsBesideTestModules();
        $this->journal->actAsUserId(TestIds::of(7));

        $bus = $this->app->make(CommandBus::class);
        $bus->run(new DisableSettingGroupCommand(new GroupReference('Core', 'domain_plans'), 0));

        $change = $bus->run(
            new SetStringSettingCommand(new SettingReference('Core', 'display_name'), self::JOURNAL_NAME, 1),
        );
        $this->app->forgetScopedInstances();
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);

        $this->assertSame(SettingsOutcome::Changed, $change->outcome);
        $this->assertSame(self::JOURNAL_NAME, $this->app->make(SettingsResolver::class)->string($core->displayName));
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
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

    private function switchOn(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new EnableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }

    private function switchOff(string $key): void
    {
        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', $key), $this->revision++),
        );
    }
}
