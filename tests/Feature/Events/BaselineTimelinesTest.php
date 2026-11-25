<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\ReconcileSignIns\ReconcileSignInsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\CommandEntry;
use App\Events\Accounts\AccountsChanged;
use App\Events\Assignments\AssignmentsChanged;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Support\StackTransaction;
use App\Support\StartSessions;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\TransactionCommitting;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Bus;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The order of writes, events and the commit in the flows whose order must hold, recorded through the real command entries with the real
 * listeners. An event's entry follows the writes of its synchronous listeners, which run before the recorder.
 */
#[TimeLimit(seconds: 20, reason: 'Each flow commits through the bus and empties its tables around each test.')]
final class BaselineTimelinesTest extends TestCase
{
    use CommitsHookRows;
    use SwitchesDomainsOff;
    use WithActiveAccount;

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
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'session_processes',
        'account_notices',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    /**
     * The models whose saves the timelines show.
     */
    private const array MODELS = [
        Task::class,
        TaskRun::class,
        Plan::class,
        AgentStackRow::class,
        SignInAttempt::class,
        Account::class,
    ];

    /**
     * The events the timelines show.
     */
    private const array EVENTS = [
        TaskStarted::class,
        TaskFinished::class,
        AssignmentsChanged::class,
        PlanStarted::class,
        PlanProgressChanged::class,
        AccountsChanged::class,
    ];

    /**
     * @var list<string>
     */
    private array $timeline = [];

    private AgentSession|null $session = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $events = $this->app->make(Dispatcher::class);

        foreach (self::MODELS as $model) {
            $name = class_basename($model);
            $events->listen("eloquent.saved: {$model}", fn () => $this->timeline[] = "saved {$name}");
        }

        foreach (self::EVENTS as $event) {
            $events->listen($event, fn (object $sent) => $this->timeline[] = class_basename($sent));
        }

        $events->listen(TransactionCommitting::class, function (TransactionCommitting $committing): void {
            if ($committing->connection->transactionLevel() === 1) {
                $this->timeline[] = 'commit';
            }
        });
    }

    /**
     * Task save, run and claim, TaskStarted's stack push and plan membership inside the
     * transaction, commit, then the public TaskStarted and plan progress; the claim sends no AssignmentsChanged. After
     * the commit, the new frame's instruction marker and the plan frames hearing the progress each commit on their own.
     */
    public function test_a_task_start_saves_the_task_and_run_pushes_the_stack_then_commits_and_publishes(): void
    {
        $task = $this->taskInPhase();

        $this->start($task);

        $this->assertSame([
            'saved Task',
            'saved TaskRun',
            'saved Plan',
            'saved AgentStackRow',
            'commit',
            'saved AgentStackRow',
            'commit',
            'TaskStarted',
            'PlanProgressChanged',
            'saved AgentStackRow',
            'commit',
            'commit',
        ], $this->timeline);
    }

    /**
     * A stack-owned start keeps the same order; the stack's transaction is the one that commits.
     */
    public function test_a_stack_owned_task_start_keeps_the_order_and_commits_with_the_stack(): void
    {
        $task = $this->taskInPhase();

        $this->app->make(StackTransaction::class)->run(fn () => $this->start($task));

        $this->assertSame([
            'saved Task',
            'saved TaskRun',
            'saved Plan',
            'saved AgentStackRow',
            'commit',
            'saved AgentStackRow',
            'commit',
            'TaskStarted',
            'PlanProgressChanged',
            'saved AgentStackRow',
            'commit',
            'commit',
        ], $this->timeline);
    }

    /**
     * A permitted repeated start sends TaskStarted again; the stack already holds the task and no count moved.
     */
    public function test_a_repeated_start_sends_task_started_again(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $this->timeline = [];

        $this->start($task);

        $this->assertSame(
            ['saved Task', 'commit', 'saved AgentStackRow', 'commit', 'TaskStarted'],
            $this->timeline,
        );
    }

    /**
     * Run with Plans disabled: the start keeps its order and no plan progress is projected.
     */
    public function test_with_plans_disabled_a_task_start_projects_no_plan_progress(): void
    {
        $task = $this->taskInPhase();
        $this->switchDomainOff('plans');
        $this->timeline = [];

        $this->start($task);

        $this->assertSame(
            [
                'saved Task',
                'saved TaskRun',
                'saved AgentStackRow',
                'commit',
                'saved AgentStackRow',
                'commit',
                'TaskStarted',
                'commit',
            ],
            $this->timeline,
        );
    }

    /**
     * Finish saves the task and the run and releases the claim, commits, then TaskFinished and the plan's progress
     * are delivered in the order they were raised; the task's frame and the plan's frame each commit what they heard.
     */
    public function test_a_task_finish_saves_the_task_and_run_then_commits_and_publishes(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $this->timeline = [];

        $this->finish($task);

        $this->assertSame([
            'saved Task',
            'saved TaskRun',
            'saved Plan',
            'commit',
            'saved AgentStackRow',
            'commit',
            'TaskFinished',
            'saved AgentStackRow',
            'commit',
            'commit',
            'PlanProgressChanged',
            'saved AgentStackRow',
            'commit',
        ], $this->timeline);
    }

    /**
     * Run with Plans disabled: the finish keeps its order and no plan progress is projected.
     */
    public function test_with_plans_disabled_a_task_finish_projects_no_plan_progress(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $this->switchDomainOff('plans');
        $this->timeline = [];

        $this->finish($task);

        $this->assertSame(
            [
                'saved Task',
                'saved TaskRun',
                'commit',
                'saved AgentStackRow',
                'commit',
                'TaskFinished',
                'saved AgentStackRow',
                'commit',
                'commit',
            ],
            $this->timeline,
        );
    }

    /**
     * Progress comes from each plan whose counts moved: a task finished and then moved to another plan's phase in the
     * same transaction reports the plan it finished in and the plan it was placed into.
     */
    public function test_a_finish_and_a_move_report_the_progress_of_both_plans_whose_counts_moved(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $finishedIn = (string) Phase::query()->holdingTask($task->id)->value('plan_id');
        $other = $this->phase();
        $progress = $this->progressOfPlans();

        $this->app->make(StackTransaction::class)->run(function () use ($task, $other): void {
            $this->finish($task);
            PhaseTask::query()->where('task_id', $task->id)->delete();
            $this->planStructure()->addTasks($other, [$task->id]);
        });

        $this->assertSame([$finishedIn, $other->plan_id], $progress());
    }

    /**
     * A move committed concurrently from a second connection does not change whose counts the finish moved: the plan
     * the task was counted in reports its progress.
     */
    public function test_a_finish_reports_the_plan_it_was_counted_in_despite_a_concurrent_move(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $countedIn = (string) Phase::query()->holdingTask($task->id)->value('plan_id');
        $other = $this->phase();
        $progress = $this->progressOfPlans();
        $database = $this->app->make(DatabaseManager::class);
        $this->app->make('config')->set('database.connections.concurrent', $database->connection()->getConfig());

        $this->app->make(StackTransaction::class)->run(function () use ($task, $other, $database): void {
            $this->finish($task);
            $database->connection('concurrent')->table('phase_tasks')->where('task_id', $task->id)->update(
                ['phase_id' => $other->id],
            );
        });

        $database->purge('concurrent');
        $this->assertSame([$countedIn], $progress());
    }

    /**
     * A plan start pushes the stack only on the true startOnce branch and sends PlanStarted and its opening
     * progress after the commit, which the new frame keeps; starting it again writes and sends nothing.
     */
    public function test_a_plan_start_pushes_the_stack_once_and_a_second_start_sends_nothing(): void
    {
        $plan = $this->phase()->plan()->firstOrFail();
        $this->session ??= $this->startedSession();
        $this->timeline = [];

        $this->asAgent(new StartPlanCommand($plan->id));
        $first = $this->timeline;
        $this->timeline = [];
        $this->asAgent(new StartPlanCommand($plan->id));

        $this->assertSame(
            [
                'saved Plan',
                'saved Plan',
                'saved AgentStackRow',
                'commit',
                'PlanStarted',
                'PlanProgressChanged',
                'saved AgentStackRow',
                'commit',
            ],
            $first,
        );
        $this->assertSame(['commit'], $this->timeline);
    }

    /**
     * Profiles reconciliation: each lost attempt ends and releases its account's writer before
     * the next attempt, and their AccountsChanged follow the commit in the same order.
     */
    public function test_reconciling_two_lost_attempts_ends_and_releases_each_in_turn(): void
    {
        $accounts = $this->chooseActiveAccounts();
        $first = $this->signInAgain($accounts['claude-code']);
        $second = $this->signInAgain($accounts['codex']);
        $this->claimSignIn('host-a', CarbonImmutable::now());
        $this->claimSignIn('host-a', CarbonImmutable::now());
        $events = $this->app->make(Dispatcher::class);
        $events->listen(
            AccountsChanged::class,
            fn (AccountsChanged $changed) => $this->timeline[] = "for {$changed->accountId}",
        );
        $this->timeline = [];

        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new ReconcileSignInsCommand('host-a', []),
        );

        $this->assertSame([
            'saved SignInAttempt',
            'saved Account',
            'saved SignInAttempt',
            'saved Account',
            'commit',
            'AccountsChanged',
            "for {$first->account_id}",
            'AccountsChanged',
            "for {$second->account_id}",
        ], $this->timeline);
    }

    private function taskInPhase(): Task
    {
        $task = Task::factory()->create();
        $this->planStructure()->addTasks($this->phase(), [$task->id]);
        $this->session ??= $this->startedSession();
        $this->timeline = [];

        return $task;
    }

    private function phase(): Phase
    {
        return $this->planStructure()->addPhase(Plan::factory()->create(), 'Work');
    }

    /**
     * The plans each later PlanProgressChanged names.
     *
     * @return callable(): list<string>
     */
    private function progressOfPlans(): callable
    {
        $plans = [];
        $this->app->make(Dispatcher::class)->listen(
            PlanProgressChanged::class,
            function (PlanProgressChanged $changed) use (&$plans): void {
                $plans[] = $changed->planId;
            },
        );

        return function () use (&$plans): array {
            return $plans;
        };
    }

    private function start(Task $task): void
    {
        $this->asAgent(new StartTaskCommand($task->id));
    }

    private function finish(Task $task): void
    {
        $this->asAgent(new FinishTaskCommand($task->id, $task->refresh()->run_number, 'Done.'));
    }

    /**
     * Runs the command as an agent in a session, whose stack a start pushes.
     */
    private function asAgent(object $command): void
    {
        $session = $this->session ??= $this->startedSession();
        $this->journal->actAsAgentIds($session->agent_id, $session->id);
        $this->app->make(CommandBus::class)->run($command);
    }

    private function startedSession(): AgentSession
    {
        $agent = Agent::create('Worker', 'main-agent', $this->localProject());

        return $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    private function signInAgain(Account $account): SignInAttempt
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $begin = new BeginSignInAgainCommand($account->id);
        $attemptId = $this->journal->run($begin, "again-{$account->id}")->attemptId;

        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
