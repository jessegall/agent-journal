<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\ConfirmLaunchLoss;
use App\Domain\Agents\CredentialLookup;
use App\Domain\Agents\CredentialRejected;
use App\Domain\Agents\LaunchedAgent;
use App\Domain\Agents\LaunchSessions;
use App\Domain\Agents\Models\Agent;
use App\Domain\Agents\SessionStatus;
use App\Domain\Agents\SignedCall;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Storage\FrameRecord;
use App\Domain\Hooks\Storage\StackStatus;
use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\StartTask;
use App\Domain\Tasks\TaskState;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class HookRecoveryTest extends TestCase
{
    use RefreshHookDatabase;

    private const TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->emptyTables();
        CarbonImmutable::setTestNow('2026-11-17 08:00:00');
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        $this->emptyTables();

        parent::tearDown();
    }

    public function test_silence_first_makes_the_loss_suspected_and_keeps_the_launch_working(): void
    {
        $launched = $this->launch();

        $this->wait(121);
        $this->losses()->reconcile();

        $this->assertSame(SessionStatus::SuspectedLost, $launched->session->fresh()?->status);
        $this->assertSame(StackStatus::Active, $this->stackOf($launched)->status);
        $this->assertSame($launched->session->id, $this->app->make(CredentialLookup::class)->sessionFor($launched->token)->id);
    }

    public function test_a_heartbeat_withdraws_the_suspicion(): void
    {
        $launched = $this->launch();
        $this->wait(121);
        $this->losses()->reconcile();

        $this->losses()->recordHeartbeat($launched->session);
        $this->wait(900);
        $this->losses()->reconcile();

        $this->assertSame(SessionStatus::SuspectedLost, $launched->session->fresh()?->status);
        $this->assertNull($launched->session->fresh()?->loss_evidence);
    }

    public function test_a_long_silence_confirms_the_loss_without_an_end_hook_and_keeps_the_obligations(): void
    {
        $launched = $this->launch();
        $task = $this->startTask($launched);

        $this->wait(121);
        $this->losses()->reconcile();
        $this->wait(901);
        $this->losses()->reconcile();

        $this->assertSame(SessionStatus::Lost, $launched->session->fresh()?->status);
        $this->assertStringStartsWith('silent since', (string) $launched->session->fresh()?->loss_evidence);
        $this->assertSame(StackStatus::Closed, $this->stackOf($launched)->status);
        $this->assertSame(['hooks.main_ready', 'tasks.working'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($launched)->frames->all()));
        $this->assertSame(TaskState::Started, $task->fresh()?->state);
        $this->assertSame(0, DB::table('hook_calls')->count());
    }

    public function test_the_host_reporting_an_exit_confirms_the_loss_at_once(): void
    {
        $launched = $this->launch();

        $this->losses()->confirmHostExit($launched->session, 'exit code 137');

        $this->assertSame(SessionStatus::Lost, $launched->session->fresh()?->status);
        $this->assertSame('host reported exit: exit code 137', $launched->session->fresh()?->loss_evidence);
        $this->assertSame(StackStatus::Closed, $this->stackOf($launched)->status);
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($launched->token);
    }

    public function test_a_replacement_launch_starts_from_its_own_bottom_and_copies_nothing(): void
    {
        $lost = $this->launch();
        $this->startTask($lost);
        $this->losses()->confirmHostExit($lost->session, 'killed');

        $replacement = $this->app->make(LaunchSessions::class)->launch($lost->session->agent, 'claude-code');

        $this->assertNotSame($lost->session->id, $replacement->session->id);
        $this->assertSame(['hooks.main_ready'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($replacement)->frames->all()));
    }

    /**
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    private function launch(): LaunchedAgent
    {
        return $this->app->make(LaunchSessions::class)->launch(Agent::query()->create(['name' => 'Test agent', 'role' => 'hooks.main_ready']), 'claude-code');
    }

    private function startTask(LaunchedAgent $launched): Task
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->instance(AgentContext::class, new AgentContext($launched->session->agent_id, $launched->session->id, 'hooks.main_ready', new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup'))));
        $this->app->make(StartTask::class)->start($task, new StackTarget($launched->session->agent_id, $launched->session->id));
        $this->app->forgetScopedInstances();

        return $task;
    }

    private function stackOf(LaunchedAgent $launched): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor(new StackTarget($launched->session->agent_id, $launched->session->id))->sole();
    }

    private function losses(): ConfirmLaunchLoss
    {
        return $this->app->make(ConfirmLaunchLoss::class);
    }

    private function wait(int $seconds): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds($seconds));
    }

    private function emptyTables(): void
    {
        foreach (self::TABLES as $table) {
            DB::table($table)->truncate();
        }
    }
}
