<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Events\Sessions\SessionOpened;
use App\Events\Skills\SkillRead;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\AgentSession;
use App\Skills\Commands\AskSkillRead\AskSkillReadCommand;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Exceptions\SkillReadRefused;
use App\Stacks\Support\ReadSkillStateReference;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * An ask puts one reading state on the stack of the session it names, with each skill once on its list, for a Claude
 * Code and a Codex session alike; a finished state is replaced by a fresh one; a refused ask leaves every stack as it
 * was.
 */
#[TestsCommand(AskSkillReadCommand::class)]
final class AskSkillReadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agent_stacks',
        'skill_generations',
        'command_receipts',
        'agents',
        'agent_sessions',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->agent('Reader');
        $this->journal->idleAgent('Coder')->startSession('Coder', 'CodexStart', TestSelections::of('codex'));
        $this->journal->refreshSkills();
    }

    public function test_two_asks_give_one_frame_that_holds_each_key_once(): void
    {
        $session = $this->handed($this->journal->sessionOf('Writer'));
        [$first, $second] = $session->skill_keys;

        $this->ask($session, [$first]);
        $this->ask($session, [$first, $second]);

        $this->journal->stateOn($session, ReadSkillStateReference::forSession($session->id), fn (StateHandle $reading) => $reading->tick(
            fn (StateAssert $state) => $state->where('skillKeys', [$first, $second]),
        ));
    }

    public function test_it_asks_a_codex_session_the_same_way(): void
    {
        $session = $this->handed($this->journal->sessionCalled('CodexStart'));
        [$first] = $session->skill_keys;

        $this->assertSame([$first], $this->ask($session, [$first]));

        $this->journal->stateOn($session, ReadSkillStateReference::forSession($session->id), fn (StateHandle $reading) => $reading->tick(
            fn (StateAssert $state) => $state->where('skillKeys', [$first]),
        ));
    }

    public function test_an_ask_after_the_state_finished_pushes_a_fresh_frame(): void
    {
        $session = $this->handed($this->journal->sessionOf('Writer'));
        [$first, $second] = $session->skill_keys;
        $this->ask($session, [$first]);
        $this->journal->stateOn($session, ReadSkillStateReference::forSession($session->id), fn (StateHandle $reading) => $reading->event(
            new SkillRead($session->id, $first, ReadEvidence::SkillShow),
            fn (StateAssert $state) => $state->isFinished(),
        ));

        $this->ask($session, [$second]);

        $this->journal->stateOn($session, ReadSkillStateReference::forSession($session->id), fn (StateHandle $reading) => $reading->tick(
            fn (StateAssert $state) => $state->where('skillKeys', [$second]),
        ));
    }

    public function test_an_ask_for_one_session_leaves_the_state_of_another_alone(): void
    {
        $writer = $this->handed($this->journal->sessionOf('Writer'));
        $reader = $this->handed($this->journal->sessionOf('Reader'));

        $this->ask($writer, [$writer->skill_keys[0]]);

        $this->journal->assertNoFrame($reader, ReadSkillStateReference::forSession($reader->id));
    }

    public function test_a_key_the_session_was_not_handed_is_refused_naming_it_and_the_stack_stays(): void
    {
        $session = $this->handed($this->journal->sessionOf('Writer'));

        $this->expectException(SkillReadRefused::class);
        $this->expectExceptionMessage('no-such-skill');

        try {
            $this->ask($session, [$session->skill_keys[0], 'no-such-skill']);
        } finally {
            $this->journal->assertNoFrame($session, ReadSkillStateReference::forSession($session->id));
        }
    }

    public function test_a_session_that_ended_is_refused_and_the_stack_stays(): void
    {
        $session = $this->handed($this->journal->sessionOf('Writer'));
        $session->endAt(now()->toImmutable());

        $this->expectException(SkillReadRefused::class);

        try {
            $this->ask($session, [$session->skill_keys[0]]);
        } finally {
            $this->journal->assertNoFrame($session, ReadSkillStateReference::forSession($session->id));
        }
    }

    private function handed(AgentSession $session): AgentSession
    {
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($session->agent_id, $session->id));
        $handed = AgentSession::findById($session->id);
        $this->assertGreaterThanOrEqual(2, count($handed->skill_keys));

        return $handed;
    }

    /**
     * @param  list<string>  $keys
     * @return list<string>
     */
    private function ask(AgentSession $session, array $keys): array
    {
        $this->journal->actAsAgentIds($session->agent_id, $session->id);

        return $this->journal->runUnkeyed(new AskSkillReadCommand($session->id, $keys))->skillKeys;
    }
}
