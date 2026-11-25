<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Assignments\AssignmentQuery;
use App\Contracts\Bus\CommandBus;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorIdentity;
use App\Support\ListenerRegistry;
use App\Support\PoolMembers;
use App\Support\StartSessions;
use Closure;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Commands\WaiveTaskWait\WaiveTaskWaitCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Exceptions\TaskWaitsUnmet;
use Domain\Tasks\Listeners\PushTaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\StartNamedTask;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Event;
use RuntimeException;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Tasks\FailsAfterPush;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Settings\SwitchesDomainsOff;

/**
 * An agent starts a task: it opens the task's first run, claimed by the agent, and a retry under the same key gets
 * that run; another agent is refused while it runs, and a task that ended is not started again.
 */
final class StartTaskTest extends TestCase
{
    use CommitsHookRows;
    use SwitchesDomainsOff;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
        'assignments',
        'agent_stacks',
        'command_receipts',
        'users',
        'agents',
        'agent_sessions',
        'number_groups',
        'inboxes',
        'inbox_members',
        'task_history',
        'task_waits',
        'task_wait_history',
        'plans',
        'phases',
        'phase_tasks',
        'session_tokens',
        'hook_calls',
        'links',
        'settings_records',
    ];

    private const string START_KEY = '01JD8X0G9M3QZ6V4K2STARTKEY1';

    private TaskFixtures $tasks;

    private Task $dependent;

    private Task $prerequisite;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->tasks = $this->journal->fixtures(TaskFixtures::class)->task('Owned work', 'Build it.');
    }

    public function test_a_start_opens_one_run_claimed_by_the_agent_and_a_keyed_retry_gets_it(): void
    {
        $start = new StartTaskCommand($this->tasks->taskCalled('Owned work')->id);

        $run = $this->journal->actAs('First')->run($start, self::START_KEY);
        $retry = $this->journal->run($start, self::START_KEY);

        $this->assertSame([
            1,
            1,
        ], [
            $run,
            $retry,
        ]);
        $this->tasks->assertStarted('Owned work', by: 'First')->assertRunCount('Owned work', 1);
    }

    public function test_another_agent_is_refused_while_the_task_runs(): void
    {
        $work = $this->journal->startScenario(new StartNamedTask(owner: 'Owner', worker: 'First', task: 'Draft'));

        $this->journal->actAs('Second')->assertRefused(
            TaskRunTaken::class,
            fn () => $this->journal->run(new StartTaskCommand($work->task->id)),
        );

        $this->tasks->assertStarted('Draft', by: 'First')->assertRunCount('Draft', 1);
    }

    public function test_a_task_that_ended_is_not_started_again(): void
    {
        $work = $this->journal->startScenario(new StartNamedTask(owner: 'Owner', worker: 'First', task: 'Draft'));
        $this->journal->run(new FinishTaskCommand($work->task->id, $work->run->run_number, 'Done.'));

        $this->journal->assertRefused(
            TaskRestartRefused::class,
            fn () => $this->journal->run(new StartTaskCommand($work->task->id)),
        );
    }

    public function test_a_start_outside_the_browser_sends_one_page_signal_after_its_commit(): void
    {

        Event::fake([TaskStartCommitted::class]);
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        Event::assertDispatchedTimes(TaskStartCommitted::class, 1);

        Event::assertDispatched(
            TaskStartCommitted::class,
            fn (TaskStartCommitted $sent) => $sent->taskId === $task->id,
        );
    }

    public function test_an_unmet_wait_keeps_the_task_out_of_starts_and_the_pool_until_its_prerequisite_finishes(): void
    {
        $this->prerequisite = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $this->dependent = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->assertThrows(
            fn () => $this->runCommand(new StartTaskCommand($this->dependent->id)),
            TaskWaitsUnmet::class,
        );

        $this->assertNotContains($this->dependent->id, $this->pooled());

        $this->runCommand(new StartTaskCommand($this->prerequisite->id));
        $this->runCommand(new FinishTaskCommand($this->prerequisite->id, 1, 'Done.'));

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
    }

    public function test_a_waiver_makes_the_task_startable(): void
    {
        $this->prerequisite = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $this->dependent = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->runCommand(
            new WaiveTaskWaitCommand($this->dependent->id, $this->prerequisite->id, 'Done by hand.'),
        );

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
    }

    public function test_a_blocked_task_with_a_new_unmet_wait_cannot_restart_and_a_repeat_start_keeps_the_run(): void
    {
        $this->prerequisite = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $this->dependent = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));

        $this->runCommand(new BlockTaskCommand($this->dependent->id, 1, 'Waits for records.'));
        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->assertThrows(
            fn () => $this->runCommand(new StartTaskCommand($this->dependent->id)),
            TaskWaitsUnmet::class,
        );
    }

    public function test_starting_a_task_sends_task_started_with_the_starter_each_time_it_is_started(): void
    {
        $task = Task::factory()->create();
        $sent = $this->recordedSends();

        $this->runAsOwner(new StartTaskCommand($task->id));
        $this->runAsOwner(new StartTaskCommand($task->id));

        $classes = array_map(fn (object $event) => $event::class, $sent());

        $this->assertSame([
            TaskStarted::class,
            TaskStarted::class,
        ], $classes);
        $this->assertSame($this->journal->ownerUser()->id, $sent()[0]->actor->id);
        $this->assertEquals($sent()[0], unserialize(serialize($sent()[0])));
    }

    public function test_the_start_and_its_repeat_each_name_the_actor_that_started_the_task(): void
    {
        $agent = $this->journal->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $task = $this->tasks()->task('task')->taskCalled('task');
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
        $agent = $this->journal->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $plan = Plan::factory()->create();
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $progress = $this->heard(PlanProgressChanged::class);

        $this->start($task);

        $this->assertSame([$plan->id], array_map(fn (PlanProgressChanged $changed) => $changed->planId, $progress()));
    }

    public function test_a_task_in_no_phase_tells_no_plan(): void
    {
        $agent = $this->journal->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $progress = $this->heard(PlanProgressChanged::class);

        $this->start($this->tasks()->task('Loose')->taskCalled('Loose'));

        $this->assertSame([], $progress());
    }

    public function test_with_plans_switched_off_the_start_works_and_tells_no_plan(): void
    {
        $agent = $this->journal->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $plan = Plan::factory()->create();
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Work'), [$task->id]);
        $this->switchDomainOff('plans');
        $progress = $this->heard(PlanProgressChanged::class);

        $this->start($task);

        $this->assertSame(TaskStatus::Started, $task->refresh()->status);
        $this->assertSame([], $progress());
    }

    public function test_a_failure_after_the_push_leaves_no_task_run_or_stack_change(): void
    {
        $agent = $this->journal->idleAgent('Worker', 'main-agent')->agentCalled('Worker');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $task = $this->tasks()->task('task')->taskCalled('task');
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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }

    private function runCommand(object $command): mixed
    {
        return $this->journal->run($command);
    }

    /**
     * @return list<string>
     */
    private function pooled(): array
    {
        return Task::resolveCandidates(
            PoolMembers::all(),
            $this->app->make(AssignmentQuery::class)->assignedIds(TaskType::linkType()),
            50,
        )->ids;
    }

    private function runAsOwner(object $command): void
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    /**
     * The facts of Tasks and Plans the commands send from now on, in the order they reach their listeners.
     *
     * @return Closure(): list<object>
     */
    private function recordedSends(): Closure
    {
        $sent = [];

        $events = [
            TaskStarted::class,
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
            PlanStarted::class,
            PlanFinished::class,
            PlanCancelled::class,
        ];

        foreach ($events as $event) {
            $this->app->make(Dispatcher::class)->listen($event, function (object $fact) use (&$sent): void {
                $sent[] = $fact;
            });
        }

        return function () use (&$sent): array {
            return $sent;
        };
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
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
}
