<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Values\ProfileBase;
use App\Settings\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Settings\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Enums\SettingTarget;
use App\Settings\Events\SettingsChanged;
use App\Settings\Exceptions\SettingDisabled;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Exceptions\SettingsConflict;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedSetting;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail\SetIntegerSettingThenFailCommand;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsCommandModules;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The settings commands on the bus, end to end: only the owner changes settings, each change is one new revision
 * checked against the revision it was made at, a group that is switched off keeps its settings unchangeable but
 * intact, and resets remove one entry without reading it.
 */
final class SettingsCommandsTest extends TestCase
{
    use ChangesReviewsSettings;
    use CommitsHookRows;
    use InstallsCommandModules;
    use UsesReviewsSettings;

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
        $this->actAs(ActorContext::forUser($this->ownerId));
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
        $this->assertSame(1, SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->revision);
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
        $this->assertSame(1, SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->revision);
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

        $this->actAs(TestActors::user(8));
        $this->assertRefused(SettingsAccessDenied::class, $command);

        $this->actAs(ActorContext::forUser($this->ownerId));
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

    public function test_resetting_one_invalid_override_removes_only_it_and_keeps_its_siblings_byte_for_byte(): void
    {
        $this->storeDirectly(fn (SettingsDocument $document) => $document
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of('not a number')))
            ->withSetting(new EncodedSetting('weight', EncodedValue::of('0.75')))
            ->withSetting(new EncodedSetting('summary_style', EncodedValue::of([1, 2])))
            ->withSetting(new EncodedSetting('retired_key', EncodedValue::of(true))));
        $before = $this->storedText();

        $this->assertChange(
            SettingsOutcome::Changed,
            2,
            $this->runCommand($this->commands->reset($this->reviews->retryLimit, 1)),
        );

        $this->assertSame(
            str_replace('{"key":"retry_limit","value":"not a number"},', '', $before),
            $this->storedText(),
        );
    }

    public function test_resetting_a_setting_without_an_override_changes_nothing(): void
    {
        $this->assertChange(
            SettingsOutcome::Unchanged,
            0,
            $this->runCommand($this->commands->reset($this->reviews->title, 0)),
        );
    }

    public function test_switching_a_group_off_and_on_keeps_every_saved_setting(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->runCommand($this->commands->stringChoice($this->reviews->summaryStyle, 'long', 1));

        $this->assertChange(
            SettingsOutcome::Changed,
            3,
            $this->runCommand($this->commands->disable($this->reviews->review, 2)),
        );
        $this->assertChange(
            SettingsOutcome::Unchanged,
            3,
            $this->runCommand($this->commands->disable($this->reviews->review, 3)),
        );
        $this->assertChange(
            SettingsOutcome::Changed,
            4,
            $this->runCommand($this->commands->enable($this->reviews->review, 3)),
        );

        $review = $this->reviewGroup();
        $this->assertSame(4, $review->integer($this->reviews->retryLimit));
        $this->assertSame('long', $review->choice($this->reviews->summaryStyle));
    }

    public function test_resetting_an_invalid_switch_makes_the_group_follow_its_default_with_its_settings_intact(): void
    {
        $this->storeDirectly(fn (SettingsDocument $document) => $document
            ->withToggle(new EncodedToggle('review', EncodedValue::of('on')))
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of(6))));

        $this->assertRefused(SettingStorageInvalid::class, $this->commands->integer($this->reviews->retryLimit, 4, 1));
        $this->assertChange(
            SettingsOutcome::Changed,
            2,
            $this->runCommand($this->commands->resetGroup($this->reviews->review, 1)),
        );
        $this->assertChange(
            SettingsOutcome::Unchanged,
            2,
            $this->runCommand($this->commands->resetGroup($this->reviews->review, 2)),
        );

        $this->assertSame(6, $this->reviewGroup()->integer($this->reviews->retryLimit));
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
        return SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->document;
    }

    private function storedText(): string
    {
        return (string) SettingsRecord::query()->where('owner', 'Reviews')->sole()->getRawOriginal('document');
    }
}
