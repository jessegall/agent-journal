<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainRegistry;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsReader;
use App\Settings\Enums\SettingsOutcome;
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
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use Closure;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;
use Throwable;

/**
 * The settings commands on the bus, end to end: only the owner changes settings, each change is one new revision
 * checked against the revision it was made at, a group that is switched off keeps its settings unchangeable but
 * intact, and resets remove one entry without reading it.
 */
final class SettingsCommandsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private ReviewSettings $reviews;

    private SettingCommands $commands;

    private string $ownerId;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings);
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new RegisteredSettingCommands($registry);
        $this->ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->ownerId));
        $this->actAs(ActorContext::forUser($this->ownerId));
    }

    public function test_the_owner_changes_a_setting_once_and_the_same_command_again_changes_nothing(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0)));
        $this->assertChange(SettingsOutcome::Unchanged, 1, $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 1)));
        $this->assertSame(4, $this->reviewGroup()->integer($this->reviews->retryLimit));
    }

    public function test_a_value_equal_to_the_default_is_stored_as_an_override(): void
    {
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->integer($this->reviews->retryLimit, 3, 0)));
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
        $this->assertChange(SettingsOutcome::Changed, 1, $this->runCommand($this->commands->disable($this->reviews->review, 0)));

        $this->assertRefused(SettingDisabled::class, $this->commands->integer($this->reviews->retryLimit, 4, 1));
        $this->assertRefused(SettingDisabled::class, $this->commands->reset($this->reviews->retryLimit, 1));
        $this->assertSame(1, SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->revision);
    }

    public function test_an_agent_another_user_and_a_forged_address_are_refused_before_any_record_is_touched(): void
    {
        $command = new SetIntegerSetting(new SettingReference('Reviews', 'retry_limit'), 4, 0);

        $this->actAs(ActorContext::forAgent(TestIds::of(3)));
        $this->assertRefused(UserActorRequired::class, $command);

        $this->actAs(ActorContext::forUser(TestIds::of(8)));
        $this->assertRefused(SettingsAccessDenied::class, $command);

        $this->actAs(ActorContext::forUser($this->ownerId));
        $this->assertRefused(SettingUnavailable::class, new SetIntegerSetting(new SettingReference('Reviews', 'not_declared'), 4, 0));
        $this->assertRefused(SettingUnavailable::class, new SetIntegerSetting(new SettingReference('Forged', 'retry_limit'), 4, 0));

        $this->assertSame(0, SettingsRecord::query()->count());
    }

    public function test_a_command_of_the_wrong_type_or_a_value_past_a_bound_is_refused(): void
    {
        $this->assertRefused(SettingValueInvalid::class, new SetIntegerSetting(new SettingReference('Reviews', 'title'), 4, 0));
        $this->assertRefused(SettingValueInvalid::class, $this->commands->integer($this->reviews->retryLimit, 11, 0));
        $this->assertRefused(SettingValueInvalid::class, new EnableSettingGroup(new GroupReference('Reviews', 'general'), 0));

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

        $this->assertChange(SettingsOutcome::Changed, 2, $this->runCommand($this->commands->reset($this->reviews->retryLimit, 1)));

        $this->assertSame(str_replace('{"key":"retry_limit","value":"not a number"},', '', $before), $this->storedText());
    }

    public function test_resetting_a_setting_without_an_override_changes_nothing(): void
    {
        $this->assertChange(SettingsOutcome::Unchanged, 0, $this->runCommand($this->commands->reset($this->reviews->title, 0)));
    }

    public function test_switching_a_group_off_and_on_keeps_every_saved_setting(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->runCommand($this->commands->stringChoice($this->reviews->summaryStyle, 'long', 1));

        $this->assertChange(SettingsOutcome::Changed, 3, $this->runCommand($this->commands->disable($this->reviews->review, 2)));
        $this->assertChange(SettingsOutcome::Unchanged, 3, $this->runCommand($this->commands->disable($this->reviews->review, 3)));
        $this->assertChange(SettingsOutcome::Changed, 4, $this->runCommand($this->commands->enable($this->reviews->review, 3)));

        $review = $this->reviewGroup();
        $this->assertSame(4, $review->integer($this->reviews->retryLimit));
        $this->assertSame('long', $review->stringChoice($this->reviews->summaryStyle));
    }

    public function test_resetting_an_invalid_switch_makes_the_group_follow_its_default_with_its_settings_intact(): void
    {
        $this->storeDirectly(fn (SettingsDocument $document) => $document
            ->withToggle(new EncodedToggle('review', EncodedValue::of('on')))
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of(6))));

        $this->assertRefused(SettingStorageInvalid::class, $this->commands->integer($this->reviews->retryLimit, 4, 1));
        $this->assertChange(SettingsOutcome::Changed, 2, $this->runCommand($this->commands->resetGroup($this->reviews->review, 1)));
        $this->assertChange(SettingsOutcome::Unchanged, 2, $this->runCommand($this->commands->resetGroup($this->reviews->review, 2)));

        $this->assertSame(6, $this->reviewGroup()->integer($this->reviews->retryLimit));
    }

    private function actAs(ActorContext $actor): void
    {
        $this->app->make(CurrentActorSetter::class)->set($actor);
    }

    /**
     * @param  Command<SettingsChange>  $command
     */
    private function runCommand(Command $command): SettingsChange
    {
        return $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * @param  class-string<Throwable>  $refusal
     * @param  Command<SettingsChange>  $command
     */
    private function assertRefused(string $refusal, Command $command): void
    {
        try {
            $this->runCommand($command);
            $this->fail("The command was not refused with {$refusal}.");
        } catch (Throwable $thrown) {
            $this->assertInstanceOf($refusal, $thrown);
        }
    }

    private function assertChange(SettingsOutcome $outcome, int $revision, SettingsChange $change): void
    {
        $this->assertSame(['Reviews', $revision, $outcome], [$change->owner, $change->revision, $change->outcome]);
    }

    private function reviewGroup(): EnabledSettingsGroup
    {
        $this->app->forgetScopedInstances();
        $group = $this->app->make(SettingsReader::class)->group($this->reviews->review);
        $this->assertInstanceOf(EnabledSettingsGroup::class, $group);

        return $group;
    }

    private function storedDocument(): SettingsDocument
    {
        return SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->document;
    }

    /**
     * @param  Closure(SettingsDocument): SettingsDocument  $change
     */
    private function storeDirectly(Closure $change): void
    {
        SettingsRecord::insertIfAbsent('Reviews');
        $record = SettingsRecord::sharedRuntimeForOwner('Reviews')->get();
        $record->revise($change($record->document));
    }

    private function storedText(): string
    {
        return (string) DB::table('settings_records')->where('owner', 'Reviews')->value('document');
    }
}
