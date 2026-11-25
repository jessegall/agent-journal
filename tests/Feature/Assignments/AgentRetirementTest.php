<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Sessions\StartTransaction;
use Throwable;
use Closure;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\AgentRetirementDenied;
use App\Exceptions\CommandTransactionMismatch;
use App\Exceptions\CredentialRejected;
use App\Exceptions\StartRefused;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\AgentSessions;
use App\Support\AssigneeIdentity;
use App\Support\CredentialLookup;
use App\Support\SessionTokens;
use App\Support\StartSessions;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Retiring an agent: it releases every record the agent held, ends its usable sessions and credentials, and only the
 * owner, or a main agent retiring an agent that is not a main agent, may do it. A retirement that had to wait for work
 * given in the meantime still releases that work.
 */
#[TimeLimit(seconds: 5, reason: 'Retirement waits out locks another connection holds.')]
final class AgentRetirementTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    /**
     * How often the forked child looks for the waiting retirement before it gives up and commits anyway.
     */
    private const int WAIT_CHECKS = 100_000;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'tasks',
        'assignments',
    ];

    private User $owner;

    private Agent $main;

    private Agent $helper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::create('Main', 'main-agent');
        $this->helper = Agent::create('Helper', 'read-only-helper');
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_the_owner_retires_an_agent_releasing_its_work_and_ending_its_sessions(): void
    {
        $session = $this->app->make(StartSessions::class)->start(
            $this->helper,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign(
            Task::factory()->create(['title' => 'One'])->assignmentIdentity(),
            AssigneeIdentity::of($this->helper),
        );
        $writer->assign(
            Task::factory()->create(['title' => 'Two'])->assignmentIdentity(),
            AssigneeIdentity::of($this->helper),
        );

        $result = $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->helper->id));

        $this->assertCount(2, $result->changes);
        $this->assertTrue($this->helper->refresh()->isRetired());
        $this->assertSame(0, AssignmentRecord::query()->count());
        $ended = AgentSession::query()->with('sessionToken')->findOrFail($session->id);
        $this->assertFalse($ended->isActive());
        $this->assertNotNull($ended->sessionToken?->revoked_at);
    }

    public function test_a_main_agent_retires_a_helper_but_not_itself_and_a_helper_retires_nobody(): void
    {
        $this->startRequestAs($this->helper->id, TestIds::of(2));
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->main->id)),
            ActorNotAllowed::class,
        );

        $this->startRequestAs($this->main->id, TestIds::of(1));
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->main->id)),
            AgentRetirementDenied::class,
        );
        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->helper->id));

        $this->assertTrue($this->helper->refresh()->isRetired());
        $this->assertFalse($this->main->refresh()->isRetired());
    }

    public function test_retirement_refuses_to_join_a_transaction_the_bus_did_not_open(): void
    {
        DB::transaction(function (): void {
            $this->assertThrows(
                fn () => $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->helper->id)),
                CommandTransactionMismatch::class,
            );
        });

        $this->assertFalse($this->helper->refresh()->isRetired());
    }

    public function test_a_retirement_that_waited_for_work_given_meanwhile_still_releases_it(): void
    {
        $task = Task::factory()->create(['title' => 'Given while retirement waits']);
        DB::disconnect();
        [$parentEnd, $childEnd] = $this->handshake();
        $child = pcntl_fork();

        if ($child === 0) {
            $this->runChild(fn () => $this->giveWorkWhileHoldingTheSharedLock($task->id, $childEnd), $childEnd);
        }

        $this->assertSame("locked\n", fgets($parentEnd));
        DB::reconnect();
        $result = $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->helper->id));
        pcntl_waitpid($child, $status);

        $this->assertCount(1, $result->changes);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_retired_agent_cannot_be_started_and_its_credential_is_refused(): void
    {
        $started = $this->app->make(StartSessions::class)->start(
            $this->helper,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        Agent::query()->whereKey($this->helper->id)->update(['retired_at' => now()]);

        $this->assertThrows(
            fn () => $this->app->make(StartSessions::class)->start(
                $this->helper->refresh(),
                TestSelections::of('claude-code'),
                TestSelections::requestId(),
            ),
            StartRefused::class,
        );
        $this->assertThrows(
            fn () => $this->app->make(CredentialLookup::class)->sessionFor($started->token),
            CredentialRejected::class,
        );
    }

    public function test_ending_a_session_keeps_the_agents_work(): void
    {
        $started = $this->app->make(StartSessions::class)->start(
            $this->helper,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            Task::factory()->create(['title' => 'Kept'])->assignmentIdentity(),
            AssigneeIdentity::of($this->helper),
        );

        $this->app->make(StartSessions::class)->end($started->session);

        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    public function test_a_start_committed_while_retirement_waits_is_ended_by_it(): void
    {
        DB::disconnect();
        [$parentEnd, $childEnd] = $this->handshake();
        $child = pcntl_fork();

        if ($child === 0) {
            $this->runChild(fn () => $this->startWhileHoldingTheSharedLock($childEnd), $childEnd);
        }

        $this->assertSame("locked\n", fgets($parentEnd));
        DB::reconnect();
        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->helper->id));
        pcntl_waitpid($child, $status);

        $session = AgentSession::query()->with('sessionToken')->where('agent_id', $this->helper->id)->sole();
        $this->assertFalse($session->isActive());
        $this->assertNotNull($session->sessionToken?->revoked_at);
    }

    /**
     * The forked process: it writes what a start writes, a session under the shared lifecycle lock and its
     * credential, tells the parent it holds the lock, waits until the retirement is seen waiting for it, commits and
     * leaves.
     *
     * @param  resource  $parent
     */
    private function startWhileHoldingTheSharedLock($parent): never
    {
        DB::reconnect();
        $this->app->make(StartTransaction::class)->run(function () use ($parent): void {
            $session = $this->app->make(AgentSessions::class)->start(
                $this->helper,
                TestSelections::of(),
                TestSelections::requestId(),
            );
            $this->app->make(SessionTokens::class)->issue($session);
            $this->holdUntilTheRetirementWaits($parent);
        });
        DB::disconnect();

        exit(0);
    }

    /**
     * The forked process: it takes the helper's shared lifecycle lock as the writer does, gives it a task, holds on a
     * lock until the retirement is seen waiting for it, then commits and leaves.
     *
     * @param  resource  $parent
     */
    private function giveWorkWhileHoldingTheSharedLock(string $taskId, $parent): never
    {
        DB::reconnect();
        DB::transaction(function () use ($taskId, $parent): void {
            Agent::query()->whereKey($this->helper->id)->sharedLock()->sole();
            DB::table('assignments')->insert(
                [
                    'id' => strtolower((string) Str::ulid()),
                    'record_type' => 'tasks.task',
                    'record_id' => $taskId,
                    'holder_type' => 'agent',
                    'holder_id' => $this->helper->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );
            $this->holdUntilTheRetirementWaits($parent);
        });
        DB::disconnect();

        exit(0);
    }

    /**
     * Tells the parent the lock is held, then waits until another connection is waiting for a lock: the order of the
     * two processes comes from the database's state, never from a delay.
     *
     * @param  resource  $parent
     */
    private function holdUntilTheRetirementWaits($parent): void
    {
        fwrite($parent, "locked\n");

        for ($attempt = 0; $attempt < self::WAIT_CHECKS; $attempt++) {
            // Inside a transaction Postgres keeps one activity snapshot; clear it so each check sees the other session.
            DB::select('SELECT pg_stat_clear_snapshot()');

            $waiting = (int) DB::scalar("SELECT count(*) FROM pg_stat_activity WHERE wait_event_type = 'Lock' AND datname = current_database() AND pid <> pg_backend_pid()");

            if ($waiting > 0) {
                return;
            }
        }
    }

    /**
     * Runs the forked child's work and always ends the child, so a failure never runs the rest of the suite a second
     * time; the parent reads the failure in place of the lock signal.
     *
     * @param  Closure(): never  $work
     * @param  resource  $parent
     */
    private function runChild(Closure $work, $parent): never
    {
        try {
            $work();
        } catch (Throwable $failure) {
            fwrite($parent, $failure::class.': '.$failure->getMessage()."\n");
        }

        exit(1);
    }

    /**
     * Two connected ends: the forked child writes on one, the parent reads on the other.
     *
     * @return array{resource, resource}
     */
    private function handshake(): array
    {
        $ends = stream_socket_pair(STREAM_PF_UNIX, STREAM_SOCK_STREAM, STREAM_IPPROTO_IP);

        if ($ends === false) {
            $this->fail('No socket pair for the handshake.');
        }

        return [$ends[0], $ends[1]];
    }
}
