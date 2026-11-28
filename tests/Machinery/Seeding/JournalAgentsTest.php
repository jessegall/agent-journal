<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Hooks\Enums\ContextStartType;
use App\Sessions\Enums\SessionStatus;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Agents\TestSession;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;
use Throwable;

/**
 * An agent of the test is acted on in its own scope and its session in the agent's: the session beats, falls silent,
 * exits and starts its context again; an agent the test did not seed is refused by its name.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalAgentsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'hook_calls'];

    public function test_a_session_falls_silent_and_a_beat_makes_it_active_again(): void
    {
        $this->journal->owner()
            ->idleAgent('Writer')->startSession('Writer', 'Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
                fn (TestSession $session) => $session->silentFor(121),
            ))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('agents.Writer.session.status', SessionStatus::Silent))
            ->withAgent('Writer', fn (TestAgent $writer) => $writer
                ->session(fn (TestSession $session) => $session->beat()))
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Writer.session', fn (Assert $session) => $session
                    ->where('status', SessionStatus::Active)
                    ->missing('silentSince')
                    ->has('lastHeartbeat')
                    ->etc()));
    }

    public function test_an_exited_session_ends_and_a_context_start_keeps_its_reminders(): void
    {
        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer
                ->session(fn (TestSession $session) => $this->assertIsList(
                    $session->handSkills()->startContext(ContextStartType::Start)->reminders(),
                )))
            ->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
                fn (TestSession $session) => $session->exited('exit code 0'),
            ))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('agents.Writer.session.status', SessionStatus::Ended));
    }

    public function test_a_revoked_or_ended_session_and_a_retired_agent_refuse_a_beat(): void
    {
        $this->journal->owner()
            ->agent('Revoked')
            ->agent('Ended')
            ->agent('Retired')
            ->withAgent('Revoked', fn (TestAgent $revoked) => $revoked->session(
                fn (TestSession $session) => $session->revokeToken(),
            ))
            ->withAgent('Ended', fn (TestAgent $ended) => $ended->session(fn (TestSession $session) => $session->end()))
            ->withAgent('Retired', fn (TestAgent $retired) => $retired->retire());

        foreach (['Revoked', 'Ended', 'Retired'] as $agent) {
            $this->journal->assertRefused(
                Throwable::class,
                fn (TestJournal $journal) => $journal->withAgent($agent, fn (TestAgent $refused) => $refused->session(
                    fn (TestSession $session) => $session->beat(),
                )),
            );
        }
    }

    public function test_an_agent_the_test_did_not_seed_is_refused_by_its_name(): void
    {
        $this->journal->owner()->assertRefused(
            FixtureRefused::class,
            fn (TestJournal $journal) => $journal->withAgent('Nobody', fn (TestAgent $nobody) => $nobody->retire()),
        );
    }

    public function test_the_owner_delivers_a_message_to_an_agent(): void
    {
        $this->journal->owner()->agent('Writer')->withAgent(
            'Writer',
            fn (TestAgent $writer) => $writer->deliver('first', 'Run: ls.'),
        );

        $this->journal->assertJournal(fn (Assert $journal) => $journal->has('agents.Writer.runtime'));
    }
}
