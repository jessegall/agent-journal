<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Values\StopCondition;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\RefusalCode;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Contracts\ProfileReader;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The profile reader answers from the activated revision only: its type maps to Core's role, its launch policy comes
 * back whole with the writer's clean-worktree stop condition and required container, a key without an activated
 * revision is profiles-unavailable, and the proposal file changes nothing the reader answers.
 */
final class ProfileReaderTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
    }

    public function test_the_revision_table_holds_the_launch_policy_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('profile_revisions', [
            'program',
            'program_pinned',
            'allowed_models',
            'access_policy',
            'stop_conditions',
            'execution_policy',
            'configuration_hash',
            'provenance',
        ]));
    }

    public function test_a_reader_profile_maps_to_the_read_only_helper_role(): void
    {
        $activation = $this->activate('journal-reviewer', ProfileType::ReadOnlyHelper);

        $snapshot = $this->reader()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame(AgentRole::ReadOnlyHelper, $snapshot->type->agentRole());
        $this->assertSame(AgentRole::ReadOnlyHelper, $snapshot->launch->access->role);
        $this->assertSame(HookProgram::Codex, $snapshot->launch->program);
        $this->assertFalse($snapshot->launch->programPinned);
        $this->assertSame(['opus', 'sonnet'], $snapshot->launch->allowedModels);
        $this->assertSame([], $snapshot->launch->stopConditions->conditions);
        $this->assertSame(ExecutionModeType::RequiredContainer, $snapshot->launch->execution->mode);
        $this->assertSame($activation->configurationHash, $snapshot->launch->provenance->configurationHash);
        $this->assertSame(PolicyOriginType::GlobalDefault, $snapshot->launch->provenance->originOf('access'));
    }

    public function test_a_writer_profile_keeps_clean_worktree_and_the_required_container(): void
    {
        $this->activate('journal-worker', ProfileType::WritingHelper);

        $snapshot = $this->reader()->snapshotFor(ProfileKey::from('journal-worker'));

        $this->assertSame(AgentRole::WritingHelper, $snapshot->type->agentRole());
        $this->assertSame(
            [StopCondition::CLEAN_WORKTREE],
            array_map(fn (StopCondition $condition) => $condition->key, $snapshot->launch->stopConditions->conditions),
        );
        $this->assertSame(ExecutionModeType::RequiredContainer, $snapshot->launch->execution->mode);
        $this->assertSame(ProfileLaunchPolicy::HELPER_IMAGE, $snapshot->launch->execution->imageReference);
        $this->assertSame(ProfileType::MainAgent->agentRole(), AgentRole::MainAgent);
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
                $this->reader()->snapshotFor(ProfileKey::from($key));
                $this->fail("Profile {$key} was read without an activated revision.");
            } catch (ProfileMissing $missing) {
                $this->assertSame(RefusalCode::ProfilesUnavailable, $missing->refusalCode());
            }
        }
    }

    public function test_the_proposal_file_changes_nothing_the_reader_answers(): void
    {
        $this->activate('journal-reviewer', ProfileType::ReadOnlyHelper);
        $before = $this->reader()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $proposal = ['profiles' => ['journal-reviewer' => ['type' => 'writing_helper']]];
        $this->app->make('config')->set('profiles', $proposal);

        $after = $this->reader()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame($before->type, $after->type);
        $this->assertEquals($before->launch->provenance, $after->launch->provenance);
        $this->artisan('profile:show', ['key' => 'journal-reviewer'])
            ->expectsOutputToContain('Type: read_only_helper')
            ->assertSuccessful();
    }

    public function test_a_damaged_launch_policy_column_fails_the_read(): void
    {
        $this->activate('journal-reviewer', ProfileType::ReadOnlyHelper);
        DB::table('profile_revisions')->update(['access_policy' => '{"class_grants": 3}']);

        $this->expectException(ProfileRevisionUnreadable::class);

        $this->reader()->snapshotFor(ProfileKey::from('journal-reviewer'));
    }

    private function activate(string $key, ProfileType $type): ProfileActivation
    {
        $proposal = TestProposals::of(TestProposals::profile($key, $type));

        return $this->app->make(CommandBus::class)->run(new ActivateProfiles($proposal));
    }

    private function reader(): ProfileReader
    {
        return $this->app->make(ProfileReader::class);
    }
}
