<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Skills\SkillPublisher;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Skills\PublicationState;
use App\Events\Sessions\SessionOpened;
use App\Exceptions\SkillSelectionConflict;
use App\Exceptions\StartRefused;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillPublication;
use App\Support\ActorContext;
use App\Support\DomainRegistry;
use App\Support\HostSkillPublisher;
use App\Support\OpenedRuntime;
use App\Support\StartGrant;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Skills\PublishesSkills;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start admits its skills before anything spawns: the selected set is published after the start commits and its
 * grant hands the host the files and arguments, recording the generation; a failed set refuses the grant, a driver
 * without an adapter and a required skill outside the selection refuse the start.
 */
final class StartSkillsTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;
    use InstallsBuiltInProfiles;
    use PublishesSkills;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const string NO_SPACE = 'no space left';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'profile_revisions',
        'profiles',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    private const string FOLDER = '/work/project';

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_a_codex_start_gets_its_set_written_before_spawn_and_records_the_generation(): void
    {
        [$host, $opened] = $this->openCodexRuntime();
        $publication = SkillPublication::latestOfSession($opened->sessionId);

        $this->assertNotNull($publication);
        $this->assertSame(PublicationState::Delivered, $publication->state);
        $this->assertFileExists("{$this->root}/targets/{$opened->sessionId}/codex/journal/SKILL.md");

        $grant = $this->asSystem(new ClaimStartGrantCommand($host, $opened->runtimeId));

        $this->assertInstanceOf(StartGrant::class, $grant);
        $this->assertCount(1, $grant->folders);
        $this->assertSame('skills', $grant->folders[0]->name);
        $this->assertSame([], $grant->folders[0]->arguments);
        $this->assertContains('journal/SKILL.md', array_map(fn ($file) => $file->path, $grant->folders[0]->files));
        $this->assertSame($publication->generation_id, AgentSession::byId($opened->sessionId)->skill_generation_id);
    }

    public function test_a_failed_set_refuses_the_grant_so_nothing_spawns(): void
    {
        $this->app->instance(SkillPublisher::class, new FullDiskPublisher($this->app->make(HostSkillPublisher::class)));
        [$host, $opened] = $this->openCodexRuntime();

        $this->expectException(StartRefused::class);
        $this->expectExceptionMessage(self::NO_SPACE);

        $this->asSystem(new ClaimStartGrantCommand($host, $opened->runtimeId));
    }

    public function test_a_program_without_a_skill_adapter_is_refused_by_name(): void
    {
        $session = $this->sessionRow(Agent::create('Other driver', 'main-agent', $this->localProject()), 'gemini-cli', null);

        $this->expectException(StartRefused::class);
        $this->expectExceptionMessage('gemini-cli');

        $this->started($session);
    }

    public function test_a_required_skill_outside_the_selection_refuses_the_start_with_its_key(): void
    {
        $this->activateReviewer(['journal-plans']);
        $session = $this->sessionRow(Agent::create('Reviewer', 'read-only-helper', $this->localProject()), 'claude-code', 1);

        $this->expectException(SkillSelectionConflict::class);
        $this->expectExceptionMessage('journal-plans');

        $this->started($session);
    }

    #[TimeLimit(seconds: 3, reason: 'It starts two sessions with their accounts and writes two skill sets.')]
    public function test_two_sessions_in_one_work_folder_keep_their_own_sets_and_never_a_union(): void
    {
        $this->activateReviewer([]);
        $main = $this->sessionRow(Agent::create('Main', 'main-agent', $this->localProject()), 'claude-code', null);
        $reviewer = $this->sessionRow(Agent::create('Reviewer', 'read-only-helper', $this->localProject()), 'claude-code', 1);

        $this->started($main);
        $this->started($reviewer);

        $mainSet = SkillPublication::latestOfSession($main->id);
        $reviewerSet = SkillPublication::latestOfSession($reviewer->id);
        $this->assertNotNull($mainSet);
        $this->assertNotNull($reviewerSet);
        $this->assertNotSame($mainSet->target, $reviewerSet->target);
        $this->assertNotSame($mainSet->selection_digest, $reviewerSet->selection_digest);
        $this->assertContains('journal-plans', $mainSet->skill_keys);
        $this->assertNotContains('journal-plans', $reviewerSet->skill_keys);
        $this->assertSame(PublicationState::Delivered, $mainSet->state);
        $this->assertSame(PublicationState::Delivered, $reviewerSet->state);
    }

    /**
     * @param  list<string>  $requiredSkills
     */
    private function activateReviewer(array $requiredSkills): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: $requiredSkills,
            ),
        )));
    }

    /**
     * @return array{0: string, 1: OpenedRuntime}
     */
    private function openCodexRuntime(): array
    {
        $host = $this->asSystem(new EnrollHostCommand('test host', [self::FOLDER]));
        $agent = Agent::create('Codex agent', 'main-agent', $this->localProject());
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $opened = $this->app->make(CommandBus::class)->run(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'codex',
            '0.165.0',
            'codex',
            DriverType::Headless,
            'gpt-5.5',
        ));

        return [$host->hostId, $opened];
    }

    private function sessionRow(Agent $agent, string $driver, int|null $profileRevision): AgentSession
    {
        $session = new AgentSession()->forceFill([
            ...TestSelections::sessionColumns(),
            'driver_key' => $driver,
            'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer',
            'profile_revision' => $profileRevision ?? 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function started(AgentSession $session): void
    {
        $this->app->make(AdmitStartSkills::class)->handle(
            new SessionOpened($session->agent_id, $session->id),
        );
    }
}
