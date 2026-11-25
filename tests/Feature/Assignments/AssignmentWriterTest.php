<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\AssignmentWriter;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\AssigneeUnavailable;
use App\Exceptions\AssignmentConflict;
use App\Exceptions\RecordUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;

/**
 * The assignment writer: the owner and a main agent give out work, no other agent may; one holder per record; a
 * reassignment names the reference it read; and the lifecycle locks make a waiting retirement see every assignment
 * committed before it.
 */
final class AssignmentWriterTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use UsesSecondConnection;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private User $owner;

    private Agent $main;

    private Agent $helper;

    private RecordIdentity $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::create('Main', 'main-agent');
        $this->helper = Agent::create('Helper', 'read-only-helper');
        $this->task = Task::factory()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_the_owner_assigns_once_and_the_same_holder_is_unchanged_while_another_conflicts(): void
    {
        $first = $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper));
        $again = $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper));

        $this->assertSame(AssignmentOutcomeType::Changed, $first->outcomes[0]->type);
        $this->assertNull($first->changes[0]->before);
        $this->assertSame(AssignmentOutcomeType::Unchanged, $again->outcomes[0]->type);
        $this->assertSame([], $again->changes);
        $this->assertTrue($again->outcomes[0]->current->reference->isSameAs($first->outcomes[0]->current->reference));
        $this->assertThrows(
            fn () => $this->writer()->assign($this->task, AssigneeIdentity::of($this->main)),
            AssignmentConflict::class,
        );
    }

    public function test_a_main_agent_gives_out_work_and_a_helper_may_not(): void
    {
        $this->startRequestAs($this->main->id, TestIds::of(1));
        $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper));

        $this->startRequestAs($this->helper->id, TestIds::of(2));
        $other = Task::factory()->create(['title' => 'Other'])->assignmentIdentity();
        $this->assertThrows(
            fn () => $this->writer()->assign($other, AssigneeIdentity::of($this->main)),
            ActorNotAllowed::class,
        );
    }

    public function test_a_reassignment_needs_the_reference_it_read_even_after_a_round_trip(): void
    {
        $first = $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper))->outcomes[0]->current;
        $toMain = $this->writer()->reassign(
            $this->task,
            $first->reference,
            AssigneeIdentity::of($this->main),
        )->outcomes[0]->current;
        $back = $this->writer()->reassign(
            $this->task,
            $toMain->reference,
            AssigneeIdentity::of($this->helper),
        )->outcomes[0]->current;

        $this->assertThrows(
            fn () => $this->writer()->reassign($this->task, $first->reference, AssigneeIdentity::of($this->main)),
            AssignmentConflict::class,
        );
        $this->assertSame(
            AssignmentOutcomeType::Unchanged,
            $this->writer()->reassign(
                $this->task,
                $back->reference,
                AssigneeIdentity::of($this->helper),
            )->outcomes[0]->type,
        );
    }

    public function test_releasing_removes_the_holder_and_releasing_an_unheld_record_is_unchanged(): void
    {
        $held = $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper))->outcomes[0]->current;

        $released = $this->writer()->unassign($this->task, $held->reference);
        $again = $this->writer()->unassign($this->task, $held->reference);

        $this->assertNull($released->outcomes[0]->current);
        $this->assertCount(1, $released->changes);
        $this->assertSame(AssignmentOutcomeType::Unchanged, $again->outcomes[0]->type);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_an_ineligible_recipient_or_a_missing_record_is_refused(): void
    {
        $stranger = User::factory()->create();
        $this->helper->retireAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->writer()->assign($this->task, AssigneeIdentity::of($stranger)),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper)),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->writer()->assign(
                TestActors::record('tasks.task', 999999),
                AssigneeIdentity::of($this->main),
            ),
            RecordUnavailable::class,
        );
    }

    public function test_a_retirement_waits_for_an_assignment_in_progress_and_then_sees_it(): void
    {
        $other = $this->otherConnection();

        $this->app->make(AssignmentTransaction::class)->run(function () use ($other): void {
            $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper));

            $this->assertThrows(
                fn () => $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE NOWAIT', [$this->helper->id]),
                QueryException::class,
            );
        });

        $other->transaction(function () use ($other): void {
            $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE', [$this->helper->id]);

            $this->assertCount(
                1,
                $other->select(
                    "SELECT id FROM assignments WHERE holder_type = 'agent' AND holder_id = ?",
                    [$this->helper->id],
                ),
            );
        });
    }

    public function test_two_writers_on_one_unheld_record_leave_one_holder(): void
    {
        $other = $this->otherConnection();
        $attempts = 0;

        $this->expectException(AssignmentConflict::class);

        try {
            $this->app->make(AssignmentTransaction::class)->run(function () use (&$attempts, $other): void {
                $attempts++;
                AssignmentRecord::query()->count();

                if ($attempts === 1) {
                    $other->table('assignments')->insert(
                        [
                            'id' => strtolower((string) Str::ulid()),
                            'record_type' => $this->task->type,
                            'record_id' => $this->task->id,
                            'holder_type' => 'agent',
                            'holder_id' => $this->main->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    );
                }

                $this->writer()->assign($this->task, AssigneeIdentity::of($this->helper));
            });
        } finally {
            $this->assertSame(2, $attempts);
            $this->assertSame(1, $other->table('assignments')->count());
        }
    }

    private function writer(): AssignmentWriter
    {
        return $this->app->make(AssignmentWriterInTransaction::class);
    }
}
