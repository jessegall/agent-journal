<?php

declare(strict_types=1);

namespace Tests\Machinery\Skills;

use App\Events\Skills\SkillRead;
use App\Hooks\Enums\ContextStartType;
use App\Listeners\AskRequiredSkillReads;
use App\Models\Agents\AgentSession;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Stacks\Support\ReadSkillStateReference;
use App\Values\ProfileBase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\ScenarioTick;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateObservation;
use Tests\TestCase;

/**
 * A session start, a clear and a compaction ask the agent to read the skills its profile requires that its start
 * handed it, in the profile's order, for either driver; a resume, a profile requiring nothing and a session handed
 * nothing ask nothing, and an ask while the state is active neither adds a frame nor spends the tool uses again.
 */
#[TestsMachinery(AskRequiredSkillReads::class)]
final class AskRequiredSkillReadsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agent_stacks',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
        $this->journal->owner();

        foreach (['user-first', 'user-second'] as $key) {
            $sections = [new SectionDraft('notes', 'Notes', 'Text.')];
            $this->journal->skill($key, new SkillDraft($key, 'Read.', $sections, ''));
        }
    }

    public function test_a_new_claude_code_session_holds_one_reading_state_listing_both_skills_in_profile_order(): void
    {
        $this->requiring(['user-second', 'user-first']);
        $session = $this->started('Reviewer', 'claude-code');

        $this->journal->startContext($session, ContextStartType::Start);

        $this->assertListed($session, ['user-second', 'user-first']);
    }

    public function test_a_codex_session_is_asked_the_same(): void
    {
        $this->requiring(['user-first', 'user-second']);
        $session = $this->started('Coder', 'codex');

        $this->journal->startContext($session, ContextStartType::Start);

        $this->assertListed($session, ['user-first', 'user-second']);
    }

    public function test_a_profile_requiring_nothing_asks_nothing(): void
    {
        $this->requiring([]);
        $session = $this->started('Reviewer', 'claude-code');

        $this->journal->startContext($session, ContextStartType::Start);

        $this->journal->assertNoFrame($session, ReadSkillStateReference::forSession($session->id));
    }

    public function test_a_resume_asks_nothing(): void
    {
        $this->requiring(['user-first']);
        $session = $this->started('Reviewer', 'claude-code');

        $this->journal->startContext($session, ContextStartType::Resume);

        $this->journal->assertNoFrame($session, ReadSkillStateReference::forSession($session->id));
    }

    public function test_a_clear_and_a_compaction_ask_again_without_a_second_frame_or_a_new_budget(): void
    {
        $this->requiring(['user-first']);
        $session = $this->started('Reviewer', 'claude-code');
        $this->journal->startContext($session, ContextStartType::Start);
        $reference = ReadSkillStateReference::forSession($session->id);
        $this->journal->stateOn($session, $reference)->given(
            [$this->hooks($session)->toolFinished(), $this->hooks($session)->toolFinished('pwd')],
            fn (StateObservation $state) => $state->assertValue('toolUses', 2),
        );

        $this->journal->startContext($session, ContextStartType::Clear);
        $this->journal->startContext($session, ContextStartType::Compact);

        $this->journal->stateOn($session, $reference)->given(
            new ScenarioTick(),
            function (StateObservation $state) {
                $state->assertValue('skillKeys', ['user-first']);
                $state->assertValue('toolUses', 2);
            },
        );
    }

    public function test_a_compaction_asks_again_after_the_state_finished(): void
    {
        $this->requiring(['user-first']);
        $session = $this->started('Reviewer', 'claude-code');
        $this->journal->startContext($session, ContextStartType::Start);
        $reference = ReadSkillStateReference::forSession($session->id);
        $this->journal->stateOn($session, $reference)->given(
            new SkillRead($session->id, 'user-first', ReadEvidence::SkillShow),
            fn (StateObservation $state) => $state->assertFinished(),
        );

        $this->journal->startContext($session, ContextStartType::Compact);

        $this->journal->stateOn($session, $reference)->given(
            new ScenarioTick(),
            fn (StateObservation $state) => $state->assertValue('skillKeys', ['user-first']),
        );
    }

    private function hooks(AgentSession $session): SessionHooks
    {
        return $this->journal->hooksFor($session);
    }

    /**
     * @param  list<string>  $skills
     */
    private function requiring(array $skills): void
    {
        $profile = TestProposals::profile(
            'journal-reviewer',
            ProfileBase::readOnlyHelper(),
            'Review.',
            requiredSkills: $skills,
        );
        $this->journal->activatedProfile(TestProposals::of($profile));
        $this->journal->refreshSkills();
    }

    private function started(string $agent, string $driver): AgentSession
    {
        $selection = TestSelections::of($driver)->pinnedTo('journal-reviewer', 1);
        $this->journal->idleAgent($agent, 'read-only-helper')->startSession($agent, "{$agent}Start", $selection);

        return AgentSession::findById($this->journal->sessionCalled("{$agent}Start")->id);
    }

    /**
     * @param  list<string>  $keys
     */
    private function assertListed(AgentSession $session, array $keys): void
    {
        $this->journal->stateOn($session, ReadSkillStateReference::forSession($session->id))->given(
            new ScenarioTick(),
            fn (StateObservation $state) => $state->assertValue('skillKeys', $keys),
        );
    }
}
