<?php

declare(strict_types=1);

namespace Tests\Feature\Tasks;

use App\Contracts\Bus\CommandBus;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorIdentity;
use App\Support\ListenerRegistry;
use App\Support\StartSessions;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Listeners\PushTaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\TasksDomain;
use Illuminate\Events\Dispatcher;
use RuntimeException;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Tasks\FailsAfterPush;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\TestCase;

/**
 * A task raises TaskStarted on itself with the actor that started it, first start and repeat alike; the stack push
 * and the plan's sample run in the start's transaction, so a failure after them leaves no task, run or stack change,
 * and the plan named is the one holding the task when it started.
 */
final class TaskStartFactsTest extends TestCase
{
    use CommitsHookRows;
    use SwitchesDomainsOff;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'plans',
        'phases',
        'phase_tasks',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'settings_records',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $agent = Agent::create('Worker', 'main-agent', $this->localProject());
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_the_start_and_its_repeat_each_name_the_actor_that_started_the_task(): void
    {
        $task = Task::factory()->create();
        $started = $this->heard(TaskStarted::class);

        $this->start($task);
        $this->start($task);

        $actor = ActorIdentity::fromText("agent:{$this->session->agent_id}");
        $this->assertCount(2, $started());
        $this->assertTrue($started()[0]->actor->isSameAs($actor));
        $this->assertSame($task->id, $started()[1]->taskId);
    }

    public function test_the_plan_holding_the_task_at_its_start_is_the_one_told_after_the_commit(): void
    {
        $plan = Plan::factory()->create();
        $task = Task::factory()->create();
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $progress = $this->heard(PlanProgressChanged::class);

        $this->start($task);

        $this->assertSame([$plan->id], array_map(fn (PlanProgressChanged $changed) => $changed->planId, $progress()));
    }

    public function test_a_task_in_no_phase_tells_no_plan(): void
    {
        $progress = $this->heard(PlanProgressChanged::class);

        $this->start(Task::factory()->create());

        $this->assertSame([], $progress());
    }

    public function test_with_plans_switched_off_the_start_works_and_tells_no_plan(): void
    {
        $plan = Plan::factory()->create();
        $task = Task::factory()->create();
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $this->switchDomainOff('plans');
        $progress = $this->heard(PlanProgressChanged::class);

        $this->start($task);

        $this->assertSame(TaskStatus::Started, $task->refresh()->status);
        $this->assertSame([], $progress());
    }

    public function test_a_failure_after_the_push_leaves_no_task_run_or_stack_change(): void
    {
        $task = Task::factory()->create();
        $stackRows = AgentStackRow::query()->withoutGlobalScopes()->count();
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry([
            TaskStarted::class => [
                CountPhaseTaskStates::class.'@handle',
                PushTaskState::class.'@handle',
                FailsAfterPush::class.'@handle',
            ],
        ]));

        $this->assertThrows(fn () => $this->start($task), RuntimeException::class);

        $this->assertSame(TaskStatus::Open, $task->refresh()->status);
        $this->assertSame(0, TaskRun::query()->where('task_id', $task->id)->count());
        $this->assertSame($stackRows, AgentStackRow::query()->withoutGlobalScopes()->count());
    }

    private function start(Task $task): void
    {
        $this->journal->actAsAgentIds($this->session->agent_id, $this->session->id);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
    }

    /**
     * Each event of the class the dispatcher delivers from now on.
     *
     * @template TEvent of object
     *
     * @param  class-string<TEvent>  $event
     * @return callable(): list<TEvent>
     */
    private function heard(string $event): callable
    {
        $heard = [];
        $this->app->make(Dispatcher::class)->listen($event, function (object $sent) use (&$heard): void {
            $heard[] = $sent;
        });

        return function () use (&$heard): array {
            return $heard;
        };
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
