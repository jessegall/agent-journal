<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Exceptions\CredentialRejected;
use App\Sessions\Enums\SessionStatus;
use App\Support\ServerClock;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Schema;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Agents\TestSession;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * A heartbeat of a running session records the database server's time and makes a silent session active again; an
 * ended, revoked or retired one is refused and nothing is written.
 */
#[TestsCommand(RecordHeartbeatCommand::class)]
final class RecordHeartbeatTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'hook_calls'];

    public function test_a_beat_records_the_database_server_time(): void
    {
        $before = $this->journal->service(ServerClock::class)->now()->startOfSecond();

        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer
                ->session(fn (TestSession $session) => $session->beat()))
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Writer.session', fn (Assert $session) => $session
                    ->where('status', SessionStatus::Active)
                    ->where('lastHeartbeat', fn (CarbonImmutable $beat) => $beat->betweenIncluded(
                        $before,
                        $this->journal->service(ServerClock::class)->now()->addSecond(),
                    ))
                    ->etc()));
    }

    public function test_a_beat_makes_a_silent_session_active_again(): void
    {
        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer->session(fn (TestSession $session) => $session
                ->silentFor(121)
                ->beat()))
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Writer.session', fn (Assert $session) => $session
                    ->where('status', SessionStatus::Active)
                    ->missing('silentSince')
                    ->etc()));
    }

    public function test_a_beat_of_an_ended_session_is_refused_and_writes_nothing(): void
    {
        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
                fn (TestSession $session) => $session->exited('exit code 0'),
            ));

        $this->assertBeatRefused(CredentialRejected::revoked());
    }

    public function test_a_beat_with_a_revoked_credential_is_refused_and_writes_nothing(): void
    {
        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
                fn (TestSession $session) => $session->revokeToken(),
            ));

        $this->assertBeatRefused(CredentialRejected::revoked());
    }

    public function test_a_beat_of_a_retired_agent_is_refused_and_writes_nothing(): void
    {
        $this->journal->owner()->agent('Writer')->withAgent('Writer', fn (TestAgent $writer) => $writer->retire());

        $this->assertBeatRefused(CredentialRejected::agentRetired());
    }

    public function test_a_beat_of_a_session_with_an_ended_status_but_a_live_credential_is_refused(): void
    {
        $this->journal->owner()
            ->agent('Writer')
            ->withAgent('Writer', fn (TestAgent $writer) => $writer
                ->session(fn (TestSession $session) => $session->end()));

        $this->assertBeatRefused(CredentialRejected::sessionEnded());
    }

    public function test_the_session_table_indexes_status_and_last_heartbeat(): void
    {
        $indexes = array_map(fn (array $index) => $index['columns'], Schema::getIndexes('agent_sessions'));

        $this->journal->assertResult(true, in_array(['status', 'last_heartbeat_at'], $indexes, true));
    }

    /**
     * The writer's beat is refused as the expected refusal is, and the session keeps no heartbeat.
     */
    private function assertBeatRefused(CredentialRejected $expected): void
    {
        $this->journal
            ->assertRefused(
                CredentialRejected::class,
                fn (TestJournal $journal) => $journal->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
                    fn (TestSession $session) => $session->beat(),
                )),
                fn (CredentialRejected $rejected) => $this->assertSame(
                    $expected->getMessage(),
                    $rejected->getMessage(),
                ),
            )
            ->assertJournal(fn (Assert $journal) => $journal->missing('agents.Writer.session.lastHeartbeat'));
    }
}
