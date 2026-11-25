<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Assignments\AssignmentPool;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\PoolMembers;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\CandidateLimitInvalid;
use Domain\Tasks\Exceptions\TaskNotOpenForAssignment;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\Assignments\AssignedWorkProvider;
use Domain\Tasks\Support\Assignments\AutoAssigner;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * Tasks counts the unfinished tasks an actor holds, picks open tasks nobody holds in its pool's order with the
 * filtering done before the limit, and refuses to give out a task that is no longer open.
 */
final class TaskAssignerTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private ActorIdentity $builder;

    private ActorIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = ActorIdentity::ofClass(Agent::class, TestIds::of(7));
        $this->reviewer = ActorIdentity::ofClass(Agent::class, TestIds::of(8));
        $this->startUserRequestAs(TestIds::of(1));
    }

    public function test_task_type_is_the_alias_tasks_are_assigned_under(): void
    {
        $this->assertSame(Task::linkType(), TaskType::linkType());
        $this->assertSame(TaskType::linkType(), Task::factory()->create()->assignmentIdentity()->type);
        $this->assertSame([
            TaskStatus::Open,
            TaskStatus::Started,
            TaskStatus::Blocked,
        ], TaskStatus::unfinished());
    }

    public function test_the_count_holds_the_actors_unfinished_tasks_only(): void
    {
        $this->hold($this->task(TaskStatus::Started), $this->builder);
        $this->hold($this->task(TaskStatus::Blocked), $this->builder);
        $this->hold($this->task(TaskStatus::Finished), $this->builder);
        $this->hold($this->task(TaskStatus::Open), $this->reviewer);

        $this->assertSame(
            2,
            $this->app->make(AssignedWorkProvider::class)->countFor(AssigneeIdentity::ofActorIdentity($this->builder)),
        );
    }

    public function test_an_all_pool_gives_the_lowest_id_open_task_nobody_holds(): void
    {
        $tasks = [$this->task(TaskStatus::Open), $this->task(TaskStatus::Open), $this->task(TaskStatus::Open)];
        sort($tasks);
        [$lowest, $middle, $highest] = $tasks;
        $this->hold($lowest, $this->reviewer);
        $this->task(TaskStatus::Started);

        $assigner = $this->app->make(AutoAssigner::class);

        $this->assertSame([$middle], $assigner->pick($this->builder, self::pool(PoolMembers::all()), 1)->ids);

        $this->assertSame(
            [
                $middle,
                $highest,
            ],
            $assigner->pick($this->builder, self::pool(PoolMembers::all()), 5)->ids,
        );
    }

    public function test_an_ordered_pool_keeps_its_order_and_filters_before_the_limit(): void
    {
        $first = $this->task(TaskStatus::Open);
        $second = $this->task(TaskStatus::Open);
        $third = $this->task(TaskStatus::Open);
        $finished = $this->task(TaskStatus::Finished);
        $this->hold($third, $this->reviewer);
        $pool = self::pool(PoolMembers::ordered([
            $third,
            $finished,
            $first,
            $second,
        ]));

        $assigner = $this->app->make(AutoAssigner::class);

        $this->assertSame([$first], $assigner->pick($this->builder, $pool, 1)->ids);
        $this->assertSame([
            $first,
            $second,
        ], $assigner->pick($this->builder, $pool, 3)->ids);
        $this->assertSame([], $assigner->pick($this->builder, self::pool(PoolMembers::ordered([])), 3)->ids);
    }

    public function test_an_ordered_pool_past_ten_ids_keeps_its_numeric_order(): void
    {
        $ids = array_map(fn () => $this->task(TaskStatus::Open), range(1, 12));
        $listed = array_reverse($ids);

        $pool = self::pool(PoolMembers::ordered($listed));

        $picked = $this->app->make(AutoAssigner::class)->pick($this->builder, $pool, 12);

        $this->assertSame($listed, $picked->ids);
    }

    public function test_a_limit_outside_one_to_a_thousand_is_refused(): void
    {
        $assigner = $this->app->make(AutoAssigner::class);

        $this->assertThrows(
            fn () => $assigner->pick($this->builder, self::pool(PoolMembers::all()), 0),
            CandidateLimitInvalid::class,
        );

        $this->assertThrows(
            fn () => $assigner->pick($this->builder, self::pool(PoolMembers::all()), 1001),
            CandidateLimitInvalid::class,
        );
    }

    public function test_a_candidate_must_still_be_open(): void
    {
        $assigner = $this->app->make(AutoAssigner::class);
        $open = Task::factory()->create();
        $finished = Task::factory()->create(['status' => TaskStatus::Finished]);

        $assigner->requireCandidate($open->assignmentIdentity());

        $this->expectException(TaskNotOpenForAssignment::class);

        $assigner->requireCandidate($finished->assignmentIdentity());
    }

    private function task(TaskStatus $state): string
    {
        return Task::factory()->create(['status' => $state])->id;
    }

    private function hold(string $taskId, ActorIdentity $holder): void
    {
        AssignmentRecord::create(
            Task::query()->findOrFail($taskId)->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($holder),
        );
    }

    private static function pool(PoolMembers $members): AssignmentPool
    {
        return new readonly class($members) implements AssignmentPool
        {
            public function __construct(private PoolMembers $members) {}

            public function members(): PoolMembers
            {
                return $this->members;
            }
        };
    }
}
