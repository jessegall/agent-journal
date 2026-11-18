<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AutoAssignmentReader;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Enums\AutoAssignmentState;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssignmentTotals;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentStatus;
use App\Assignments\Support\PoolReference;
use App\Contracts\DomainAvailability;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Where an auto-assignment stands, worked out when it is read: off without a row, inactive without a running session,
 * its domain or pool unavailable, its pool too large, full or over its size by holdings, and ready otherwise; an
 * agent reading its own status sees no totals.
 */
final class AutoAssignmentStatusTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
        'auto_assignments',
    ];

    private User $owner;

    private TestLaunch $worker;

    private AutoAssignmentKey $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->worker = TestLaunch::start('hooks.writing_helper_ready');
        $this->key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), TaskType::VALUE);
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_without_a_row_it_is_off(): void
    {
        $status = $this->currentStatus();

        $this->assertSame(AutoAssignmentState::Off, $status->state);
        $this->assertSame(0, $status->revision);
        $this->assertTrue($status->totals->isEmpty());
    }

    public function test_an_agent_without_a_running_session_is_inactive(): void
    {
        $idle = Agent::query()->create(['name' => 'Idle', 'role' => 'hooks.writing_helper_ready']);
        $this->key = new AutoAssignmentKey(ActorIdentity::of($idle), TaskType::VALUE);
        $this->enable(self::open(), 2);

        $this->assertSame(AutoAssignmentState::Inactive, $this->currentStatus()->state);
    }

    public function test_a_switched_off_tasks_domain_makes_it_unavailable(): void
    {
        $this->enable(self::open(), 2);
        $this->app->instance(DomainAvailability::class, new class implements DomainAvailability
        {
            public function isEnabled(string $owner): bool
            {
                return $owner !== 'Tasks';
            }
        });

        $this->assertSame(AutoAssignmentState::DomainUnavailable, $this->currentStatus()->state);
    }

    public function test_a_paused_plan_pool_is_unavailable_and_a_plan_past_a_thousand_tasks_too_large(): void
    {
        $paused = Plan::factory()->create(['state' => PlanState::Paused]);
        $this->enable(new PoolReference('plans.tasks', $paused->assignmentIdentity(), []), 2);

        $this->assertSame(AutoAssignmentState::PoolUnavailable, $this->currentStatus()->state);

        $large = Plan::factory()->create(['state' => PlanState::Started]);
        $large->addPhase('Build')->addTasks(array_map(fn () => strtolower((string) Str::ulid()), range(1, 1001)));
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->configure(
            new AutoAssignmentInput($this->key, new PoolReference('plans.tasks', $large->assignmentIdentity(), []), 2),
            1,
        ));

        $this->assertSame(AutoAssignmentState::TooLarge, $this->currentStatus()->state);
    }

    public function test_holdings_make_it_ready_full_or_over_capacity(): void
    {
        $this->enable(self::open(), 2);
        $this->hold(TaskState::Started);

        $ready = $this->currentStatus();

        $this->assertSame(AutoAssignmentState::Ready, $ready->state);
        $this->assertEquals(new AssignmentTotals(1, 1), $ready->totals->get());
        $this->assertSame('Open tasks', $ready->pool->get()->label);

        $this->hold(TaskState::Blocked);
        $this->hold(TaskState::Finished);

        $this->assertSame(AutoAssignmentState::Full, $this->currentStatus()->state);

        $this->hold(TaskState::Open);
        $over = $this->currentStatus();

        $this->assertSame(AutoAssignmentState::OverCapacity, $over->state);
        $this->assertEquals(new AssignmentTotals(3, 0), $over->totals->get());
    }

    public function test_an_agent_reading_its_own_status_sees_no_totals(): void
    {
        $this->enable(self::open(), 2);
        $this->startRequestAs($this->worker->agent->id, $this->worker->session->id);

        $own = $this->currentStatus();

        $this->assertSame(AutoAssignmentState::Ready, $own->state);
        $this->assertTrue($own->totals->isEmpty());
    }

    public function test_an_unreadable_pool_is_invalid(): void
    {
        $this->enable(self::open(), 2);
        DB::table('auto_assignments')->update(['pool' => '{"type": 3}']);

        $this->assertSame(AutoAssignmentState::Invalid, $this->currentStatus()->state);
    }

    private function enable(PoolReference $pool, int $size): void
    {
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable(
            new AutoAssignmentInput($this->key, $pool, $size),
            0,
        ));
    }

    private function write(callable $work): void
    {
        $this->app->make(AssignmentTransaction::class)
            ->run(fn () => $work($this->app->make(AutoAssignmentWriter::class)));
    }

    private function hold(TaskState $state): void
    {
        $task = Task::factory()->create(['state' => $state]);
        AssignmentRecord::holding($task->assignmentIdentity(), $this->key->actor);
    }

    private function currentStatus(): AutoAssignmentStatus
    {
        return $this->app->make(AutoAssignmentReader::class)->status($this->key);
    }

    private static function open(): PoolReference
    {
        return new PoolReference('tasks.open', null, []);
    }
}
