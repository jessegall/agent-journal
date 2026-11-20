<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Support\NumberedPage;
use App\Bus\Contracts\CommandBus;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\DeskSeating;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Enums\TaskView;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\ActsAsOwner;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Task readers show who holds a task apart from who works on its run, read the runs of a whole page in one batch, and
 * answer a task nobody may read like a missing one.
 */
final class TaskDetailsResolverTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'assignments',
        'command_receipts',
        'task_runs',
        'claim_authorizations',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
    ];

    public function test_a_task_held_by_a_desk_and_run_by_its_occupant_shows_both_separately(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 1, false);
        $runner = $this->start('Runner');
        $task = Task::factory()->create(['title' => 'Split work', 'brief' => 'Held by one, run by another.']);
        $this->asUser();
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $task->assignmentIdentity(),
            $desk->assigneeIdentity(),
        );
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeating::class)->seat(
            $desk->id,
            new ActorIdentity(ActorType::Agent, $runner->agent_id),
        ));
        $this->actAs($runner);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id));
        $this->asUser();

        $details = $this->app->make(TaskDetailsResolver::class)->details($task->id, TaskView::Context);

        $this->assertSame($desk->id, $details->holder->get()->holder()->id);
        $this->assertSame(
            [$runner->agent_id, 'Runner', 1, TaskWorkState::Active],
            [
                $details->execution?->actorId,
                $details->execution?->actorLabel,
                $details->execution?->runNumber,
                $details->execution?->workState,
            ],
        );
        $this->assertSame('Held by one, run by another.', $details->brief);
        $this->assertNull($this->app->make(TaskDetailsResolver::class)->details($task->id, TaskView::Summary)->brief);
    }

    #[TimeLimit(3, 'It creates twenty tasks, each with its own session and run, before the read.')]
    public function test_a_page_of_20_cards_reads_its_runs_in_one_query(): void
    {
        $runner = $this->start('Runner');
        $this->actAs($runner);

        $tasks = Task::factory()
            ->count(20)
            ->sequence(fn (Sequence $sequence) => ['title' => sprintf('Task %d', $sequence->index + 1)])
            ->create();

        foreach ($tasks as $task) {
            $this->app->make(CommandBus::class)->run(new StartTask($task->id));
        }

        $this->asUser();
        $agentReads = 0;
        DB::listen(function (QueryExecuted $query) use (&$agentReads): void {
            $agentReads += str_contains($query->sql, 'from "agents"') ? 1 : 0;
        });

        $taskPage = $this->app->make(TaskListResolver::class)->list(new TaskFilters(page: new NumberedPage(1, 20)));

        $this->assertCount(
            20,
            array_filter($taskPage->cards, fn ($card) => $card->execution?->actorLabel === 'Runner'),
        );
        // One read for the holders' names, now that starting a task gives it to its starter, and one for the runners.
        $this->assertSame(2, $agentReads);
    }

    public function test_a_task_nobody_may_read_answers_like_a_missing_one(): void
    {
        $this->asUser();

        $this->assertThrows(
            fn () => $this->app->make(TaskDetailsResolver::class)->details(TestIds::of(999999), TaskView::Summary),
            TaskMissing::class,
        );
    }

    private function start(string $name): AgentSession
    {
        $this->app->make(CurrentActorSetter::class)->clear();

        return $this->app->make(StartSessions::class)->start(
            Agent::named($name, 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
    }

    private function actAs(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $session->agent_id,
                $session->id,
                new SignedCall('call-'.bin2hex(random_bytes(4)), CarbonImmutable::now(), 'digest'),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($session->agent_id),
            TestStartAuthority::forAgent($session->agent_id),
        );
    }

    private function asUser(): void
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
    }
}
