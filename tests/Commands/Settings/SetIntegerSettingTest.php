<?php

declare(strict_types=1);

namespace Tests\Commands\Settings;

use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Commands\Settings\SetIntegerSetting\SetIntegerSettingCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver;
use App\Enums\Settings\SettingsOutcome;
use App\Enums\Settings\SettingTarget;
use App\Events\Settings\SettingsChanged;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\SettingDisabled;
use App\Exceptions\SettingsAccessDenied;
use App\Exceptions\SettingsConflict;
use App\Exceptions\SettingUnavailable;
use App\Exceptions\SettingValueInvalid;
use App\Models\Records\SettingsRecord;
use App\Support\ActorContext;
use App\Support\Storage\SettingsDocument;
use App\Values\GroupReference;
use App\Values\ProfileBase;
use App\Values\SettingReference;
use App\Values\SettingsChange;
use Domain\Rules\RulesDomain;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail\SetIntegerSettingThenFailCommand;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The owner sets a whole-number setting at the revision they read: each change is one new revision, the same value
 * again changes nothing, a value equal to the default is kept as an override, and a stale revision, a second first
 * write, a switched-off group, another actor, a wrong type or a value past a bound is refused and changes nothing.
 */
#[TestsCommand(SetIntegerSettingCommand::class)]
final class SetIntegerSettingTest extends TestCase
{
    use ChangesReviewsSettings;
    use CommitsHookRows;
    use InstallsCommandModules;
    use UsesReviewsSettings;

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    public function test_the_owner_changes_a_setting_once_and_the_same_command_again_changes_nothing(): void
    {
        $this->assertChange(
            SettingsOutcome::Changed,
            1,
            $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0)),
        );

        $this->assertChange(
            SettingsOutcome::Unchanged,
            1,
            $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 1)),
        );

        $this->assertSame(4, $this->reviewGroup()->integer($this->reviews->retryLimit));
    }

    public function test_each_changing_command_announces_one_change_after_commit_and_no_other_does(): void
    {
        $announced = [];

        Event::listen(SettingsChanged::class, function (SettingsChanged $event) use (&$announced): void {
            $announced[] = [$event->owner, $event->target, $event->key, $event->revision];
        });

        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 1));
        $this->runCommand($this->commands->reset($this->reviews->retryLimit, 1));
        $this->runCommand($this->commands->reset($this->reviews->retryLimit, 2));
        $this->runCommand($this->commands->disable($this->reviews->review, 2));
        $this->runCommand($this->commands->enable($this->reviews->review, 3));
        $this->runCommand($this->commands->resetGroup($this->reviews->review, 4));
        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 7, 0));
        $this->assertRefused(SettingValueInvalid::class, $this->commands->integer($this->reviews->retryLimit, 11, 5));

        $this->assertSame([
            ['Reviews', SettingTarget::Setting, 'retry_limit', 1],
            ['Reviews', SettingTarget::Setting, 'retry_limit', 2],
            ['Reviews', SettingTarget::Group, 'review', 3],
            ['Reviews', SettingTarget::Group, 'review', 4],
            ['Reviews', SettingTarget::Group, 'review', 5],
        ], $announced);

        $this->assertSame(
            ['owner', 'target', 'key', 'revision'],
            array_keys(get_object_vars(new SettingsChanged('Reviews', SettingTarget::Setting, 'retry_limit', 1))),
        );
    }

    public function test_a_change_rolled_back_with_its_transaction_announces_nothing(): void
    {
        $announced = 0;

        Event::listen(SettingsChanged::class, function () use (&$announced): void {
            $announced++;
        });

        $this->useSettingsBesideTestModules();
        $this->installCommandModules();
        $this->journal->actAsUserId(($this->ownerId));
        $change = $this->commands->integer($this->reviews->retryLimit, 4, 0);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                new SetIntegerSettingThenFailCommand($change->setting, $change->settingNumber, $change->expectedRevision),
            ),
            NoteWorkFailed::class,
        );

        $this->assertSame(0, $announced);
        $this->assertSame(0, SettingsRecord::query()->count());
    }

    public function test_a_value_equal_to_the_default_is_stored_as_an_override(): void
    {
        $this->assertChange(
            SettingsOutcome::Changed,
            1,
            $this->runCommand($this->commands->integer($this->reviews->retryLimit, 3, 0)),
        );

        $this->assertTrue($this->storedDocument()->setting('retry_limit')->isDefined());
    }

    public function test_a_stale_revision_is_a_conflict_even_for_the_same_value_and_the_stored_value_stays(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));

        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 5, 0));
        $this->assertSame(4, $this->reviewGroup()->integer($this->reviews->retryLimit));
        $this->assertSame(1, SettingsRecord::findSharedRuntimeForOwner('Reviews')->get()->revision);
    }

    public function test_two_first_writes_leave_one_record_and_one_conflict(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 5, 0));

        $this->assertSame(1, SettingsRecord::query()->count());
    }

    public function test_a_failed_command_leaves_no_record_it_inserted(): void
    {
        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 4, 3));

        $this->assertSame(0, SettingsRecord::query()->count());
    }

    public function test_a_setting_of_a_switched_off_group_cannot_change_and_nothing_changes(): void
    {
        $this->assertChange(
            SettingsOutcome::Changed,
            1,
            $this->runCommand($this->commands->disable($this->reviews->review, 0)),
        );

        $this->assertRefused(SettingDisabled::class, $this->commands->integer($this->reviews->retryLimit, 4, 1));
        $this->assertRefused(SettingDisabled::class, $this->commands->reset($this->reviews->retryLimit, 1));
        $this->assertSame(1, SettingsRecord::findSharedRuntimeForOwner('Reviews')->get()->revision);
    }

    public function test_an_agent_another_user_and_a_forged_address_are_refused_before_any_record_is_touched(): void
    {
        $command = new SetIntegerSettingCommand(new SettingReference('Reviews', 'retry_limit'), 4, 0);

        $agent = TestIds::of(3);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent),
            TestStartAuthority::granting(ProfileBase::mainAgent(), []),
        );

        $this->assertRefused(ActorNotAllowed::class, $command);

        $this->journal->actAsUserId(TestIds::of(8));
        $this->assertRefused(SettingsAccessDenied::class, $command);

        $this->journal->actAsUserId(($this->ownerId));

        $this->assertRefused(
            SettingUnavailable::class,
            new SetIntegerSettingCommand(new SettingReference('Reviews', 'not_declared'), 4, 0),
        );

        $this->assertRefused(
            SettingUnavailable::class,
            new SetIntegerSettingCommand(new SettingReference('Forged', 'retry_limit'), 4, 0),
        );

        $this->assertSame(0, SettingsRecord::query()->count());
    }

    public function test_a_command_of_the_wrong_type_or_a_value_past_a_bound_is_refused(): void
    {
        $this->assertRefused(
            SettingValueInvalid::class,
            new SetIntegerSettingCommand(new SettingReference('Reviews', 'title'), 4, 0),
        );

        $this->assertRefused(SettingValueInvalid::class, $this->commands->integer($this->reviews->retryLimit, 11, 0));

        $this->assertRefused(
            SettingValueInvalid::class,
            new EnableSettingGroupCommand(new GroupReference('Reviews', 'general'), 0),
        );

        $this->assertSame(0, SettingsRecord::query()->count());
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
    }

    private function reviewGroup(): EnabledSettingsGroup
    {
        $this->app->forgetScopedInstances();
        $group = $this->app->make(SettingsResolver::class)->group($this->reviews->review);
        $this->assertInstanceOf(EnabledSettingsGroup::class, $group);

        return $group;
    }

    private function storedDocument(): SettingsDocument
    {
        return SettingsRecord::findSharedRuntimeForOwner('Reviews')->get()->document;
    }
}
