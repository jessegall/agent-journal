<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\DatabaseClock;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\LaunchHeartbeats;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\Agent;
use App\Agents\Support\AgentContext;
use App\Agents\Support\CredentialLookup;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

final class HookRecoveryTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks', 'links'];

    public function test_silence_first_makes_the_session_silent_and_keeps_the_launch_working(): void
    {
        $launched = $this->launch();

        $this->startedSecondsAgo($launched, 121);
        $this->heartbeats()->markSilentLaunches();

        $this->assertSame(SessionStatus::Silent, $launched->session->refresh()->status);
        $this->assertSame(StackStatus::Active, $this->stackOf($launched)->status);
        $this->assertSame($launched->session->id, $this->app->make(CredentialLookup::class)->sessionFor($launched->token)->id);
    }

    public function test_a_session_inside_its_presence_window_stays_active(): void
    {
        $launched = $this->launch();

        $this->startedSecondsAgo($launched, 100);
        $this->heartbeats()->markSilentLaunches();

        $this->assertSame(SessionStatus::Active, $launched->session->refresh()->status);
    }

    public function test_a_heartbeat_makes_a_silent_session_active_again(): void
    {
        $launched = $this->launch();
        $this->startedSecondsAgo($launched, 121);
        $this->heartbeats()->markSilentLaunches();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($launched->session->agent_id));
        $this->app->make(CommandBus::class)->run(new RecordHeartbeat($launched->session->id));
        $this->heartbeats()->markSilentLaunches();

        $this->assertSame(SessionStatus::Active, $launched->session->refresh()->status);
        $this->assertNull($launched->session->refresh()->end_evidence);
    }

    public function test_a_long_silence_never_ends_the_session_and_keeps_the_credential_and_the_stack(): void
    {
        $launched = $this->launch();
        $task = $this->startTask($launched);

        $this->startedSecondsAgo($launched, 17 * 60);
        $this->heartbeats()->markSilentLaunches();
        $this->heartbeats()->markSilentLaunches();

        $this->assertSame(SessionStatus::Silent, $launched->session->refresh()->status);
        $this->assertNull($launched->session->refresh()->end_evidence);
        $this->assertSame($launched->session->id, $this->app->make(CredentialLookup::class)->sessionFor($launched->token)->id);
        $this->assertSame(StackStatus::Active, $this->stackOf($launched)->status);
        $this->assertSame(['hooks.main_ready', 'tasks.working'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($launched)->frames->all()));
        $this->assertSame(TaskState::Started, $task->fresh()?->state);
        $this->assertSame(0, DB::table('hook_calls')->count());
    }

    public function test_the_host_reporting_an_exit_ends_the_session_at_once(): void
    {
        $launched = $this->launch();

        $this->heartbeats()->markExited($launched->session, 'exit code 137');

        $this->assertSame(SessionStatus::Ended, $launched->session->refresh()->status);
        $this->assertSame('host reported exit: exit code 137', $launched->session->refresh()->end_evidence);
        $this->assertSame(StackStatus::Closed, $this->stackOf($launched)->status);
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($launched->token);
    }

    public function test_a_replacement_launch_starts_from_its_own_bottom_and_copies_nothing(): void
    {
        $exited = $this->launch();
        $this->startTask($exited);
        $this->heartbeats()->markExited($exited->session, 'killed');

        $replacement = $this->app->make(LaunchSessions::class)->launch($exited->session->loadMissing('agent')->agent, 'claude-code');

        $this->assertNotSame($exited->session->id, $replacement->session->id);
        $this->assertSame(['hooks.main_ready'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($replacement)->frames->all()));
    }

    private function launch(): LaunchedAgent
    {
        return $this->app->make(LaunchSessions::class)->launch(Agent::query()->create(['name' => 'Test agent', 'role' => 'hooks.main_ready']), 'claude-code');
    }

    private function startTask(LaunchedAgent $launched): Task
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->instance(AgentContext::class, new AgentContext($launched->session->agent_id, $launched->session->id, 'hooks.main_ready', new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')), null));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($launched->session->agent_id));
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $launched->session->id));
        $this->app->forgetScopedInstances();

        return $task;
    }

    private function stackOf(LaunchedAgent $launched): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor(new StackTarget($launched->session->agent_id, $launched->session->id))->sole();
    }

    private function heartbeats(): LaunchHeartbeats
    {
        return $this->app->make(LaunchHeartbeats::class);
    }

    private function startedSecondsAgo(LaunchedAgent $launched, int $seconds): void
    {
        DB::table('agent_sessions')->where('id', $launched->session->id)->update(['created_at' => $this->app->make(DatabaseClock::class)->now()->subSeconds($seconds)]);
    }
}
