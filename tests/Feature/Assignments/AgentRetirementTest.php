<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Contracts\AgentRetirement;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\CredentialLookup;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Models\AssignmentRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Retiring an agent: it releases every record the agent held, ends its usable sessions and credentials, and only the
 * owner, or a main agent retiring an agent that is not a main agent, may do it. A retirement that had to wait for work
 * given in the meantime still releases that work.
 */
final class AgentRetirementTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks', 'assignments'];

    private User $owner;

    private Agent $main;

    private Agent $helper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::query()->create(['name' => 'Main', 'role' => 'hooks.main_ready']);
        $this->helper = Agent::query()->create(['name' => 'Helper', 'role' => 'hooks.read_only_helper_ready']);
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_the_owner_retires_an_agent_releasing_its_work_and_ending_its_sessions(): void
    {
        $session = $this->app->make(LaunchSessions::class)->launch($this->helper, 'claude-code')->session;
        $writer = $this->app->make(AssignmentWriter::class);
        $writer->assign(Task::query()->create(['title' => 'One'])->assignmentIdentity(), ActorIdentity::of($this->helper));
        $writer->assign(Task::query()->create(['title' => 'Two'])->assignmentIdentity(), ActorIdentity::of($this->helper));

        $result = $this->app->make(AgentRetirement::class)->retire($this->helper->id);

        $this->assertCount(2, $result->changes);
        $this->assertTrue($this->helper->refresh()->isRetired());
        $this->assertSame(0, AssignmentRecord::query()->count());
        $ended = AgentSession::query()->with('credential')->findOrFail($session->id);
        $this->assertFalse($ended->isActive());
        $this->assertNotNull($ended->credential?->revoked_at);
    }

    public function test_a_main_agent_retires_a_helper_but_not_a_main_agent_and_a_helper_retires_nobody(): void
    {
        $this->startRequestAs($this->helper->id, 2);
        $this->assertThrows(fn () => $this->app->make(AgentRetirement::class)->retire($this->main->id), AgentRetirementDenied::class);

        $this->startRequestAs($this->main->id, 1);
        $this->assertThrows(fn () => $this->app->make(AgentRetirement::class)->retire($this->main->id), AgentRetirementDenied::class);
        $this->app->make(AgentRetirement::class)->retire($this->helper->id);

        $this->assertTrue($this->helper->refresh()->isRetired());
        $this->assertFalse($this->main->refresh()->isRetired());
    }

    public function test_retirement_refuses_to_join_an_open_transaction(): void
    {
        DB::transaction(function (): void {
            $this->assertThrows(fn () => $this->app->make(AgentRetirement::class)->retire($this->helper->id), AgentRetirementDenied::class);
        });
    }

    public function test_a_retirement_that_waited_for_work_given_meanwhile_still_releases_it(): void
    {
        $task = Task::query()->create(['title' => 'Given while retirement waits']);
        DB::disconnect();
        $child = pcntl_fork();

        if ($child === 0) {
            $this->giveWorkWhileHoldingTheSharedLock($task->id);
        }

        usleep(300_000);
        DB::reconnect();
        $result = $this->app->make(AgentRetirement::class)->retire($this->helper->id);
        pcntl_waitpid($child, $status);

        $this->assertCount(1, $result->changes);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_retired_agent_cannot_be_launched_and_its_credential_is_refused(): void
    {
        $launched = $this->app->make(LaunchSessions::class)->launch($this->helper, 'claude-code');
        Agent::query()->whereKey($this->helper->id)->update(['retired_at' => now()]);

        $this->assertThrows(fn () => $this->app->make(LaunchSessions::class)->launch($this->helper->refresh(), 'claude-code'), LaunchRefused::class);
        $this->assertThrows(fn () => $this->app->make(CredentialLookup::class)->sessionFor($launched->token), CredentialRejected::class);
    }

    public function test_ending_a_session_keeps_the_agents_work(): void
    {
        $launched = $this->app->make(LaunchSessions::class)->launch($this->helper, 'claude-code');
        $this->app->make(AssignmentWriter::class)->assign(Task::query()->create(['title' => 'Kept'])->assignmentIdentity(), ActorIdentity::of($this->helper));

        $this->app->make(LaunchSessions::class)->end($launched->session);

        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    public function test_a_launch_committed_while_retirement_waits_is_ended_by_it(): void
    {
        DB::disconnect();
        $child = pcntl_fork();

        if ($child === 0) {
            $this->launchWhileHoldingTheSharedLock();
        }

        usleep(300_000);
        DB::reconnect();
        $this->app->make(AgentRetirement::class)->retire($this->helper->id);
        pcntl_waitpid($child, $status);

        $session = AgentSession::query()->with('credential')->where('agent_id', $this->helper->id)->sole();
        $this->assertFalse($session->isActive());
        $this->assertNotNull($session->credential?->revoked_at);
    }

    /**
     * The forked process: it writes what a launch writes, a session under the shared lifecycle lock and its
     * credential, then holds on a moment so the retirement is already waiting for the lock, commits and leaves.
     */
    private function launchWhileHoldingTheSharedLock(): never
    {
        DB::reconnect();
        DB::transaction(function (): void {
            $session = $this->app->make(AgentSessions::class)->start($this->helper);
            $this->app->make(LaunchCredentials::class)->issue($session);
            usleep(800_000);
        });
        DB::disconnect();

        exit(0);
    }

    /**
     * The forked process: it takes the helper's shared lifecycle lock as the writer does, gives it a task, holds on a
     * moment so the retirement is already waiting, then commits and leaves.
     */
    private function giveWorkWhileHoldingTheSharedLock(int $taskId): never
    {
        DB::reconnect();
        DB::transaction(function () use ($taskId): void {
            DB::select('SELECT id FROM agents WHERE id = ? FOR SHARE', [$this->helper->id]);
            DB::table('assignments')->insert(['record_type' => 'tasks.task', 'record_id' => $taskId, 'holder_type' => 'agent', 'holder_id' => $this->helper->id, 'created_at' => now(), 'updated_at' => now()]);
            usleep(800_000);
        });
        DB::disconnect();

        exit(0);
    }
}
