<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\TrustedEntryAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Assignments\Support\NumberedPage;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Enums\TaskView;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Task readers show who holds a task apart from who works on its run, read the runs of a whole page in one batch, and
 * answer a task nobody may read like a missing one.
 */
final class TaskDetailsResolverTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'tasks', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'links', 'assignments', 'command_receipts'];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_a_task_held_by_one_agent_and_run_by_another_session_shows_both_separately(): void
    {
        $holder = Agent::named('Holder', AgentRole::MainAgent);
        $runner = $this->launch('Runner');
        $task = Task::factory()->create(['title' => 'Split work', 'brief' => 'Held by one, run by another.']);
        $this->asUser();
        $this->app->make(AssignmentWriterInTransaction::class)->assign($task->assignmentIdentity(), ActorIdentity::of($holder));
        $this->actAs($runner);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $runner->id));
        $this->asUser();

        $details = $this->app->make(TaskDetailsResolver::class)->details($task->id, TaskView::Context);

        $this->assertSame($holder->id, $details->holder->get()->actor()->id);
        $this->assertSame([$runner->agent_id, 'Runner', 1, TaskWorkState::Active], [$details->execution?->actorId, $details->execution?->actorLabel, $details->execution?->runNumber, $details->execution?->workState]);
        $this->assertSame('Held by one, run by another.', $details->brief);
        $this->assertNull($this->app->make(TaskDetailsResolver::class)->details($task->id, TaskView::Summary)->brief);
    }

    #[TimeLimit(3, 'It creates twenty tasks, each with its own session and run, before the read.')]
    public function test_a_page_of_20_cards_reads_its_runs_in_one_query(): void
    {
        $runner = $this->launch('Runner');
        $this->actAs($runner);

        foreach (range(1, 20) as $number) {
            $this->app->make(CommandBus::class)->run(new StartTask(Task::factory()->create(['title' => "Task {$number}"])->id, $runner->id));
        }

        $this->asUser();
        $agentReads = 0;
        DB::listen(function (QueryExecuted $query) use (&$agentReads): void {
            $agentReads += str_contains($query->sql, 'from "agents"') ? 1 : 0;
        });

        $list = $this->app->make(TaskListResolver::class)->list(new TaskFilters(page: new NumberedPage(1, 20)));

        $this->assertCount(20, array_filter($list->cards, fn ($card) => $card->execution?->actorLabel === 'Runner'));
        $this->assertSame(1, $agentReads);
    }

    public function test_a_task_nobody_may_read_answers_like_a_missing_one(): void
    {
        $this->asUser();

        $this->assertThrows(fn () => $this->app->make(TaskDetailsResolver::class)->details(TestIds::of(999999), TaskView::Summary), TaskMissing::class);
    }

    private function launch(string $name): AgentSession
    {
        $this->app->make(CurrentActorSetter::class)->clear();

        return $this->app->make(LaunchSessions::class)->launch(Agent::named($name, AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId())->session;
    }

    private function actAs(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(AgentContext::class, new AgentContext($session->agent_id, $session->id, 'hooks.main_ready', new SignedCall('call-'.bin2hex(random_bytes(4)), CarbonImmutable::now(), 'digest'), null));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($session->agent_id), new TrustedEntryAuthority('test'));
    }

    private function asUser(): void
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id), new TrustedEntryAuthority('test'));
    }
}
