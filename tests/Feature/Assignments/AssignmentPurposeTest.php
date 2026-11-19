<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Exceptions\AssignmentTypeInternal;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\PoolReference;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Public writers hand out public work only: a desk seat, an internal responsibility, is refused by the assign
 * command, the bulk writer and auto-assignment alike and changes nothing, while Core's own writer seats it.
 */
final class AssignmentPurposeTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'tasks',
        'inboxes',
        'desks',
        'desk_seats',
        'assignments',
        'auto_assignments',
        'command_receipts',
    ];

    private TestLaunch $worker;

    private DeskSeat $seat;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->worker = TestLaunch::start('writing-helper');
        $this->seat = DeskSeat::query()->ofDesk(DeskRecord::openNamed('team', 'Team', 1, false))->sole();
        $this->startUserRequestAs($owner->id);
    }

    public function test_public_writers_refuse_a_desk_seat_and_change_nothing(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $holder = $this->worker->agent->assigneeIdentity();
        $seat = $this->seat->assignmentIdentity();
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), DeskSeat::LINK_TYPE);

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->assertThrows(fn () => $bus->run(new AssignRecord($seat, $holder)), AssignmentTypeInternal::class);
        $this->assertThrows(
            fn () => $writer->assignUnfinished($holder, fn () => new AssignmentGroup($seat, [$seat])),
            AssignmentTypeInternal::class,
        );
        $this->assertThrows(
            fn () => $bus->run(new EnableAutoAssignment(
                new AutoAssignmentInput($key, new PoolReference('tasks.open', null, []), 1),
                0,
            )),
            AssignmentTypeInternal::class,
        );
        $this->assertSame(0, AssignmentRecord::query()->count());

        $task = Task::factory()->create()->assignmentIdentity();
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $bus->run(new AssignRecord($task, $holder));
        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    public function test_cores_own_writer_seats_an_internal_type_and_refuses_public_work(): void
    {
        $writer = $this->app->make(ResponsibilityWriter::class);
        $holder = $this->worker->agent->assigneeIdentity();
        $task = Task::factory()->create()->assignmentIdentity();

        $seated = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $writer->assign($this->seat->assignmentIdentity(), $holder),
        );

        $this->assertTrue($seated->holder()->isSameAs($holder));
        $this->assertThrows(
            fn () => $this->app->make(AssignmentTransaction::class)->run(fn () => $writer->assign($task, $holder)),
            AssignmentTypeUnavailable::class,
        );
    }
}
