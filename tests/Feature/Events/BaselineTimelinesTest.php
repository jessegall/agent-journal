<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Events\AssignmentsChanged;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Support\StackTransaction;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\ReconcileSignIns;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\TransactionCommitting;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Bus;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The order of writes, events and the commit in the flows whose order plan 40 must keep (doc 67 section 19, Baseline
 * and pilot exit, and Ordering during coexistence), recorded through the real command entries with the real
 * listeners. An event's entry follows the writes of its synchronous listeners, which run before the recorder.
 */
#[TimeLimit(seconds: 20, reason: 'Each flow commits through the bus and empties its tables around each test.')]
final class BaselineTimelinesTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;
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
        'start_tokens',
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
        'process_starts',
        'account_notices',
    ];

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
     * Doc 67 section 19: Task save, run and claim, TaskStarted's stack push and plan membership inside the
     * transaction, commit, then the public TaskStarted and plan progress; the claim sends no AssignmentsChanged.
     */
    public function test_a_task_start_saves_the_task_and_run_pushes_the_stack_then_commits_and_publishes(): void
    {
        $task = $this->taskInPhase();

        $this->start($task);

        $this->assertSame([
            'saved Task',
            'saved TaskRun',
            'saved AgentStackRow',
            'commit',
            'TaskStarted',
            'PlanProgressChanged',
        ], $this->timeline);
    }

    /**
     * Doc 67 section 19: a stack-owned start keeps the same order; the stack's transaction is the one that commits.
     */
    public function test_a_stack_owned_task_start_keeps_the_order_and_commits_with_the_stack(): void
    {
        $task = $this->taskInPhase();

        $this->app->make(StackTransaction::class)->run(fn () => $this->start($task));

        $this->assertSame([
            'saved Task',
            'saved TaskRun',
            'saved AgentStackRow',
            'commit',
            'TaskStarted',
            'PlanProgressChanged',
        ], $this->timeline);
    }

    /**
     * Doc 67 section 19: a permitted repeated start sends TaskStarted again; the stack already holds the task.
     */
    public function test_a_repeated_start_sends_task_started_again(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $this->timeline = [];

        $this->start($task);

        $this->assertSame(
            ['saved Task', 'commit', 'TaskStarted', 'PlanProgressChanged'],
            $this->timeline,
        );
    }

    /**
     * Doc 67 section 19, run with Plans disabled: the start keeps its order and no plan progress is projected.
     */
    public function test_with_plans_disabled_a_task_start_projects_no_plan_progress(): void
    {
        $task = $this->taskInPhase();
        $this->switchDomainOff('plans');
        $this->timeline = [];

        $this->start($task);

        $this->assertSame(
            ['saved Task', 'saved TaskRun', 'saved AgentStackRow', 'commit', 'TaskStarted'],
            $this->timeline,
        );
    }

    /**
     * Doc 67 section 19: finish saves the task and the run and releases the claim, commits, then TaskFinished is
     * delivered; the plan progress its listener sends from committed membership reaches the recorder first.
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
            'commit',
            'PlanProgressChanged',
            'TaskFinished',
        ], $this->timeline);
    }

    /**
     * Doc 67 section 19, run with Plans disabled: the finish keeps its order and no plan progress is projected.
     */
    public function test_with_plans_disabled_a_task_finish_projects_no_plan_progress(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $this->switchDomainOff('plans');
        $this->timeline = [];

        $this->finish($task);

        $this->assertSame(
            ['saved Task', 'saved TaskRun', 'commit', 'TaskFinished'],
            $this->timeline,
        );
    }

    /**
     * Doc 67 section 19: TaskFinished samples plan membership at committed delivery, so a task moved to another
     * plan's phase in the same transaction reports the progress of the plan it moved to.
     */
    public function test_a_finish_reports_the_progress_of_the_plan_the_task_moved_to_in_the_same_transaction(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
        $other = $this->phase();
        $progress = $this->progressOfPlans();

        $this->app->make(StackTransaction::class)->run(function () use ($task, $other): void {
            $this->finish($task);
            PhaseTask::query()->where('task_id', $task->id)->delete();
            $this->planStructure()->addTasks($other, [$task->id]);
        });

        $this->assertSame([$other->plan_id], $progress());
    }

    /**
     * Doc 67 section 19: a move committed concurrently from a second connection before the finish commits is the
     * membership TaskFinished's plan progress reads.
     */
    public function test_a_finish_reports_the_progress_of_the_plan_a_concurrent_move_committed(): void
    {
        $task = $this->taskInPhase();
        $this->start($task);
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
        $this->assertSame([$other->plan_id], $progress());
    }

    /**
     * Doc 67 section 19: a plan start pushes the work stack only on the true startOnce branch and sends PlanStarted
     * after the commit; starting it again writes and sends nothing.
     */
    public function test_a_plan_start_pushes_the_stack_once_and_a_second_start_sends_nothing(): void
    {
        $plan = $this->phase()->plan()->firstOrFail();
        $this->session ??= $this->startedSession();
        $this->timeline = [];

        $this->asAgent(new StartPlan($plan->id));
        $first = $this->timeline;
        $this->timeline = [];
        $this->asAgent(new StartPlan($plan->id));

        $this->assertSame(['saved Plan', 'saved AgentStackRow', 'commit', 'PlanStarted'], $first);
        $this->assertSame(['commit'], $this->timeline);
    }

    /**
     * Doc 67 section 19, Profiles reconciliation: each lost attempt ends and releases its account's writer before
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

        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new ReconcileSignIns('host-a', []),
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
        $this->asAgent(new StartTask($task->id));
    }

    private function finish(Task $task): void
    {
        $this->asAgent(new FinishTask($task->id, $task->refresh()->run_number, 'Done.'));
    }

    /**
     * Runs the command as an agent in a session, whose work stack a start pushes.
     */
    private function asAgent(object $command): void
    {
        $session = $this->session ??= $this->startedSession();
        $this->startRequestAs($session->agent_id, $session->id);
        $this->app->make(CommandBus::class)->run($command);
    }

    private function startedSession(): AgentSession
    {
        $agent = Agent::create('Worker', 'main-agent');

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
        $begin = new BeginSignInAgain($account->id, "again-{$account->id}");
        $attemptId = $this->app->make(CommandBus::class)->run($begin)->attemptId;

        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::oldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
