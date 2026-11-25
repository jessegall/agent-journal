<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Commands\Assignments\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AssignmentTypeInternal;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Desks\DeskSeat;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AssignmentGroup;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\DeskService;
use App\Support\PoolReference;
use App\Support\RequestKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
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
        'start_tokens',
        'tasks',
        'inboxes',
        'desks',
        'desk_seats',
        'assignments',
        'auto_assignments',
        'command_receipts',
    ];

    private TestStart $worker;

    private DeskSeat $seat;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->worker = TestStart::start('writing-helper');
        $this->seat = DeskSeat::query()->ofDesk($this->app->make(DeskService::class)->openNamed('team', 'Team', 1, false))->sole();
        $this->startUserRequestAs($owner->id);
    }

    public function test_public_writers_refuse_a_desk_seat_and_change_nothing(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $holder = $this->worker->agent->assigneeIdentity();
        $seat = $this->seat->assignmentIdentity();
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), DeskSeat::linkType());

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->assertThrows(fn () => $bus->run(new AssignRecordCommand($seat, $holder)), AssignmentTypeInternal::class);
        $this->assertThrows(
            fn () => $writer->assignUnfinished($holder, fn () => new AssignmentGroup($seat, [$seat])),
            AssignmentTypeInternal::class,
        );
        $this->assertThrows(
            fn () => $bus->run(new EnableAutoAssignmentCommand(
                new AutoAssignmentInput($key, new PoolReference('tasks.open', null, []), 1),
                0,
            )),
            AssignmentTypeInternal::class,
        );
        $this->assertSame(0, AssignmentRecord::query()->count());

        $task = Task::factory()->create()->assignmentIdentity();
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $bus->run(new AssignRecordCommand($task, $holder));
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
