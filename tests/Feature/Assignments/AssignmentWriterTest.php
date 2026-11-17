<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Enums\AssignmentOutcomeKind;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentDenied;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Tasks\Models\Task;
use Carbon\CarbonImmutable;
use Illuminate\Database\Connection;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
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

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments'];

    private User $owner;

    private Agent $main;

    private Agent $helper;

    private RecordIdentity $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::query()->create(['name' => 'Main', 'role' => 'hooks.main_ready']);
        $this->helper = Agent::query()->create(['name' => 'Helper', 'role' => 'hooks.read_only_helper_ready']);
        $this->task = Task::query()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->startUserRequestAs($this->owner->id);
    }

    protected function tearDown(): void
    {
        if ($this->app->make('config')->has('database.connections.writer_other')) {
            DB::connection('writer_other')->disconnect();
        }

        parent::tearDown();
    }

    public function test_the_owner_assigns_once_and_the_same_holder_is_unchanged_while_another_conflicts(): void
    {
        $first = $this->writer()->assign($this->task, ActorIdentity::of($this->helper));
        $again = $this->writer()->assign($this->task, ActorIdentity::of($this->helper));

        $this->assertSame(AssignmentOutcomeKind::Changed, $first->outcomes[0]->kind);
        $this->assertTrue($first->changes[0]->before->isEmpty());
        $this->assertSame(AssignmentOutcomeKind::Unchanged, $again->outcomes[0]->kind);
        $this->assertSame([], $again->changes);
        $this->assertTrue($again->outcomes[0]->current->get()->reference->isSameAs($first->outcomes[0]->current->get()->reference));
        $this->assertThrows(fn () => $this->writer()->assign($this->task, ActorIdentity::of($this->main)), AssignmentConflict::class);
    }

    public function test_a_main_agent_gives_out_work_and_a_helper_or_a_retired_main_may_not(): void
    {
        $this->startRequestAs($this->main->id, 1);
        $this->writer()->assign($this->task, ActorIdentity::of($this->helper));

        $this->startRequestAs($this->helper->id, 2);
        $this->assertThrows(fn () => $this->writer()->assign(Task::query()->create(['title' => 'Other'])->assignmentIdentity(), ActorIdentity::of($this->helper)), AssignmentDenied::class);

        $this->main->retireAt(CarbonImmutable::now());
        $this->startRequestAs($this->main->id, 1);
        $this->assertThrows(fn () => $this->writer()->assign(Task::query()->create(['title' => 'Third'])->assignmentIdentity(), ActorIdentity::of($this->helper)), AssignmentDenied::class);
    }

    public function test_a_reassignment_needs_the_reference_it_read_even_after_a_round_trip(): void
    {
        $first = $this->writer()->assign($this->task, ActorIdentity::of($this->helper))->outcomes[0]->current->get();
        $toMain = $this->writer()->reassign($this->task, $first->reference, ActorIdentity::of($this->main))->outcomes[0]->current->get();
        $back = $this->writer()->reassign($this->task, $toMain->reference, ActorIdentity::of($this->helper))->outcomes[0]->current->get();

        $this->assertThrows(fn () => $this->writer()->reassign($this->task, $first->reference, ActorIdentity::of($this->main)), AssignmentConflict::class);
        $this->assertSame(AssignmentOutcomeKind::Unchanged, $this->writer()->reassign($this->task, $back->reference, ActorIdentity::of($this->helper))->outcomes[0]->kind);
    }

    public function test_releasing_removes_the_holder_and_releasing_an_unheld_record_is_unchanged(): void
    {
        $held = $this->writer()->assign($this->task, ActorIdentity::of($this->helper))->outcomes[0]->current->get();

        $released = $this->writer()->unassign($this->task, $held->reference);
        $again = $this->writer()->unassign($this->task, $held->reference);

        $this->assertTrue($released->outcomes[0]->current->isEmpty());
        $this->assertCount(1, $released->changes);
        $this->assertSame(AssignmentOutcomeKind::Unchanged, $again->outcomes[0]->kind);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_an_ineligible_recipient_or_a_missing_record_is_refused(): void
    {
        $stranger = User::factory()->create();
        $this->helper->retireAt(CarbonImmutable::now());

        $this->assertThrows(fn () => $this->writer()->assign($this->task, ActorIdentity::of($stranger)), AssigneeUnavailable::class);
        $this->assertThrows(fn () => $this->writer()->assign($this->task, ActorIdentity::of($this->helper)), AssigneeUnavailable::class);
        $this->assertThrows(fn () => $this->writer()->assign(new RecordIdentity('tasks.task', 999999), ActorIdentity::of($this->main)), RecordUnavailable::class);
    }

    public function test_a_retirement_waits_for_an_assignment_in_progress_and_then_sees_it(): void
    {
        $other = $this->otherConnection();

        $this->app->make(AssignmentTransaction::class)->run(function () use ($other): void {
            $this->writer()->assign($this->task, ActorIdentity::of($this->helper));

            $this->assertThrows(
                fn () => $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE NOWAIT', [$this->helper->id]),
                QueryException::class,
            );
        });

        $other->transaction(function () use ($other): void {
            $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE', [$this->helper->id]);

            $this->assertCount(1, $other->select("SELECT id FROM assignments WHERE holder_kind = 'agent' AND holder_id = ?", [$this->helper->id]));
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
                    $other->table('assignments')->insert(['record_type' => $this->task->type, 'record_id' => $this->task->id, 'holder_kind' => 'agent', 'holder_id' => $this->main->id, 'created_at' => now(), 'updated_at' => now()]);
                }

                $this->writer()->assign($this->task, ActorIdentity::of($this->helper));
            });
        } finally {
            $this->assertSame(2, $attempts);
            $this->assertSame(1, $other->table('assignments')->count());
        }
    }

    private function writer(): AssignmentWriter
    {
        return $this->app->make(AssignmentWriter::class);
    }

    private function otherConnection(): Connection
    {
        $config = $this->app->make('config');
        $config->set('database.connections.writer_other', $config->get('database.connections.'.$config->get('database.default')));

        return DB::connection('writer_other');
    }
}
