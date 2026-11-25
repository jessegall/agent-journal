<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Engine\RefusalCode;
use App\Enums\Profiles\PolicyOriginType;
use App\Exceptions\ProfileMissing;
use App\Support\AgentImage;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Values\ExecutionBudgets;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileStartPolicy;
use App\Values\StopCondition;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\ActsAsTestUser;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The profile reader answers from the activated revision only: its type maps to Core's role, its start policy comes
 * back whole with the writer's clean-worktree stop condition and required container, a key without an activated
 * revision is profiles-unavailable, and the proposal file changes nothing the reader answers.
 */
final class ProfileResolverTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;
    use HasContainerSupport;

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    public function test_the_revision_table_holds_the_start_policy_in_one_column(): void
    {
        $this->assertTrue(Schema::hasColumn('profile_revisions', 'start_policy'));
        $this->assertFalse(Schema::hasColumn('profile_revisions', 'access_policy'));
    }

    public function test_a_reader_profile_is_a_read_only_helper(): void
    {
        $activation = $this->activate('journal-reviewer', ProfileBase::readOnlyHelper());

        $snapshot = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame(ProfileBase::readOnlyHelper()->key, $snapshot->base->key);
        $start = $snapshot->start;
        $this->assertSame(DefaultDrivers::CODEX, $start->preferredDriver);
        $this->assertSame([], $start->stopConditions->conditions);
        $this->assertSame(ExecutionModeType::RequiredContainer, $start->execution->mode);
        $this->assertSame($activation->configurationHash, $start->provenance->configurationHash);
        $this->assertSame(PolicyOriginType::GlobalDefault, $start->provenance->originOf('access'));
    }

    public function test_a_writer_profile_keeps_clean_worktree_and_the_required_container(): void
    {
        $this->activate('journal-worker', ProfileBase::writingHelper());

        $snapshot = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'));

        $start = $snapshot->start;
        $this->assertSame(ProfileBase::writingHelper()->key, $snapshot->base->key);
        $this->assertSame(
            [StopCondition::CLEAN_WORKTREE],
            array_map(fn (StopCondition $condition) => $condition->key, $start->stopConditions->conditions),
        );
        $this->assertSame(ExecutionModeType::RequiredContainer, $start->execution->mode);
        $this->assertSame(ProfileStartPolicy::HELPER_IMAGE, $start->execution->imageReference);
    }

    public function test_on_a_server_every_session_runs_in_the_agent_image_and_the_main_agent_gets_its_larger_budget(): void
    {
        $image = 'journal-agent@sha256:'.str_repeat('a', 64);
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig('contained', 'acme', '{}'));
        $this->app->instance(AgentImage::class, AgentImage::fromConfig($image));
        $this->activate('journal-main', ProfileBase::mainAgent());
        $this->activate('journal-reviewer', ProfileBase::readOnlyHelper());

        $main = $this->resolver()->snapshotFor(ProfileKey::from('journal-main'))->start->execution;
        $helper = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'))->start->execution;

        $this->assertSame([ExecutionModeType::RequiredContainer, $image], [$main->mode, $main->imageReference]);
        $this->assertSame(1024 * 1024 * 1024, $main->budgets->tmpBytes);
        $this->assertSame([ExecutionModeType::RequiredContainer, $image], [$helper->mode, $helper->imageReference]);
        $this->assertEquals(ExecutionBudgets::defaults(), $helper->budgets);
    }

    public function test_the_main_agent_defaults_to_a_terminal_and_each_helper_to_headless(): void
    {
        $this->activate('journal-main', ProfileBase::mainAgent());
        $this->activate('journal-reviewer', ProfileBase::readOnlyHelper());
        $this->activate('journal-worker', ProfileBase::writingHelper());

        $driverTypes = array_map(
            fn (string $key) => $this->resolver()->snapshotFor(ProfileKey::from($key))->base->defaultDriverType,
            ['journal-main', 'journal-reviewer', 'journal-worker'],
        );

        $this->assertSame([DriverType::Terminal, DriverType::Headless, DriverType::Headless], $driverTypes);
    }

    public function test_locally_the_main_agent_stays_on_the_protected_host_with_the_default_budget(): void
    {
        $this->activate('journal-main', ProfileBase::mainAgent());

        $main = $this->resolver()->snapshotFor(ProfileKey::from('journal-main'))->start->execution;

        $this->assertSame([ExecutionModeType::ProtectedHost, null], [$main->mode, $main->imageReference]);
        $this->assertEquals(ExecutionBudgets::defaults(), $main->budgets);
    }

    public function test_a_key_without_an_activated_revision_is_profiles_unavailable(): void
    {
        DB::table('profiles')->insert([
            'id' => strtolower((string) Str::ulid()),
            'key' => 'journal-draft',
            'label' => 'Draft',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach (['journal-draft', 'journal-unknown'] as $key) {
            try {
                $this->resolver()->snapshotFor(ProfileKey::from($key));
                $this->fail("Profile {$key} was read without an activated revision.");
            } catch (ProfileMissing $missing) {
                $this->assertSame(RefusalCode::ProfilesUnavailable, $missing->refusalCode());
            }
        }
    }

    public function test_the_proposal_file_changes_nothing_the_reader_answers(): void
    {
        $this->activate('journal-reviewer', ProfileBase::readOnlyHelper());
        $before = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $proposal = ['profiles' => ['journal-reviewer' => ['base' => 'writing-helper']]];
        $this->app->make('config')->set('profiles', $proposal);

        $after = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame($before->base->key, $after->base->key);
        $this->assertEquals($before->start->provenance, $after->start->provenance);
        $this->artisan('profile:show', ['key' => 'journal-reviewer'])
            ->expectsOutputToContain('Starts from: Read-only helper')
            ->assertSuccessful();
    }

    public function test_a_damaged_start_policy_column_fails_the_read(): void
    {
        $this->activate('journal-reviewer', ProfileBase::readOnlyHelper());
        DB::table('profile_revisions')->update(['start_policy' => '{"class_grants": 3}']);

        $this->expectException(CannotCreateData::class);

        $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));
    }

    private function activate(string $key, ProfileBase $type): ProfileActivation
    {
        $proposal = TestProposals::of(TestProposals::profile($key, $type));

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand($proposal));
    }

    private function resolver(): ProfileResolver
    {
        return $this->app->make(ProfileResolver::class);
    }
}
