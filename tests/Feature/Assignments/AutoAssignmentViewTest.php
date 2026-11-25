<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Domains\DomainAvailability;
use App\Enums\Assignments\AutoAssignmentStatus;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentTotals;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentView;
use App\Support\PoolReference;
use App\Support\Storage\DatabaseAutoAssignments;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\HasAutoAssignmentWorker;
use Tests\TestCase;

/**
 * Where an auto-assignment stands, worked out when it is read: off without a row, inactive without a running session,
 * its domain or pool unavailable, its pool too large, full or over its size by holdings, and ready otherwise; an
 * agent reading its own status sees no totals.
 */
final class AutoAssignmentViewTest extends TestCase
{
    use CommitsHookRows;
    use HasAutoAssignmentWorker;

    private const string POOL_LABEL = 'Open tasks';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
        'auto_assignments',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    public function test_without_a_row_it_is_off(): void
    {
        $status = $this->currentStatus();

        $this->assertSame(AutoAssignmentStatus::Off, $status->state);
        $this->assertSame(0, $status->revision);
        $this->assertTrue($status->totals->isEmpty());
    }

    public function test_an_agent_without_a_running_session_is_inactive(): void
    {
        $idle = Agent::create('Idle', 'writing-helper', $this->localProject());
        $this->key = new AutoAssignmentKey(ActorIdentity::of($idle), TaskType::linkType());
        $this->enable(self::open(), 2);

        $this->assertSame(AutoAssignmentStatus::Inactive, $this->currentStatus()->state);
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
        $this->app->forgetInstance(DatabaseAutoAssignments::class);

        $this->assertSame(AutoAssignmentStatus::DomainUnavailable, $this->currentStatus()->state);
    }

    public function test_a_paused_plan_pool_is_unavailable_and_a_plan_past_a_thousand_tasks_too_large(): void
    {
        $paused = Plan::factory()->create(['status' => PlanStatus::Paused]);
        $this->enable(new PoolReference('plans.tasks', $paused->assignmentIdentity(), []), 2);

        $this->assertSame(AutoAssignmentStatus::PoolUnavailable, $this->currentStatus()->state);

        $large = Plan::factory()->create(['status' => PlanStatus::Started]);
        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($large, 'Build'),
            array_map(fn () => strtolower((string) Str::ulid()), range(1, 1001)),
        );
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->configure(
            new AutoAssignmentInput($this->key, new PoolReference('plans.tasks', $large->assignmentIdentity(), []), 2),
            1,
        ));

        $this->assertSame(AutoAssignmentStatus::TooLarge, $this->currentStatus()->state);
    }

    public function test_holdings_make_it_ready_full_or_over_capacity(): void
    {
        $this->enable(self::open(), 2);
        $this->hold(TaskStatus::Started);

        $ready = $this->currentStatus();

        $this->assertSame(AutoAssignmentStatus::Ready, $ready->state);
        $this->assertEquals(new AssignmentTotals(1, 1), $ready->totals->get());
        $this->assertSame(self::POOL_LABEL, $ready->pool->get()->label);

        $this->hold(TaskStatus::Blocked);
        $this->hold(TaskStatus::Finished);

        $this->assertSame(AutoAssignmentStatus::Full, $this->currentStatus()->state);

        $this->hold(TaskStatus::Open);
        $over = $this->currentStatus();

        $this->assertSame(AutoAssignmentStatus::OverCapacity, $over->state);
        $this->assertEquals(new AssignmentTotals(3, 0), $over->totals->get());
    }

    public function test_an_agent_reading_its_own_status_sees_no_totals(): void
    {
        $this->enable(self::open(), 2);
        $this->startRequestAs($this->worker->agent->id, $this->worker->session->id);

        $own = $this->currentStatus();

        $this->assertSame(AutoAssignmentStatus::Ready, $own->state);
        $this->assertTrue($own->totals->isEmpty());
    }

    public function test_an_unreadable_pool_is_invalid(): void
    {
        $this->enable(self::open(), 2);
        DB::table('auto_assignments')->update(['pool' => '{"type": 3}']);

        $this->assertSame(AutoAssignmentStatus::Invalid, $this->currentStatus()->state);
    }

    private function enable(PoolReference $pool, int $size): void
    {
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable(
            new AutoAssignmentInput($this->key, $pool, $size),
            0,
        ));
    }

    private function write(callable $work): void
    {
        $this->app->make(AssignmentTransaction::class)
            ->run(fn () => $work($this->app->make(DatabaseAutoAssignments::class)));
    }

    private function hold(TaskStatus $state): void
    {
        $task = Task::factory()->create(['status' => $state]);
        AssignmentRecord::create($task->assignmentIdentity(), AssigneeIdentity::ofActorIdentity($this->key->actor));
    }

    private function currentStatus(): AutoAssignmentView
    {
        return $this->app->make(AutoAssignmentResolver::class)->status($this->key);
    }

    private static function open(): PoolReference
    {
        return new PoolReference('tasks.open', null, []);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
