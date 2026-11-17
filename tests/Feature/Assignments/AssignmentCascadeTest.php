<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Enums\AssignmentOutcomeKind;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Core\Assignments\Exceptions\AssignmentRootFinished;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Giving out a whole group of work at once: the root and every unfinished record go to the recipient, finished ones
 * are skipped and keep their holder, a finished root or a held root is refused, and any refusal leaves nothing written.
 */
final class AssignmentCascadeTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'plans', 'assignments'];

    private ActorIdentity $builder;

    private ActorIdentity $other;

    private Plan $plan;

    private Task $open;

    private Task $finished;

    private Task $unheld;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->builder = ActorIdentity::of(Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.read_only_helper_ready']));
        $this->other = ActorIdentity::of(Agent::query()->create(['name' => 'Other', 'role' => 'hooks.read_only_helper_ready']));
        $this->plan = Plan::query()->create(['title' => 'Release', 'kind' => PlanKind::Build]);
        $this->open = Task::query()->create(['title' => 'Open']);
        $this->finished = Task::query()->create(['title' => 'Finished']);
        $this->unheld = Task::query()->create(['title' => 'Unheld']);
        $this->writer()->assign($this->open->assignmentIdentity(), $this->other);
        $this->writer()->assign($this->finished->assignmentIdentity(), $this->other);
        $this->finished->finish();
    }

    public function test_the_root_and_every_unfinished_record_go_to_the_recipient_and_finished_ones_are_skipped(): void
    {
        $result = $this->writer()->assignUnfinished($this->builder, fn () => $this->group());

        $this->assertSame(
            [AssignmentOutcomeKind::Changed, AssignmentOutcomeKind::Changed, AssignmentOutcomeKind::SkippedFinished, AssignmentOutcomeKind::Changed],
            array_map(fn ($outcome) => $outcome->kind, $result->outcomes),
        );
        $this->assertCount(3, $result->changes);
        $this->assertTrue($this->holderOf($this->open->assignmentIdentity())->isSameAs($this->builder));
        $this->assertTrue($this->holderOf($this->finished->assignmentIdentity())->isSameAs($this->other));
    }

    public function test_a_root_held_by_another_is_refused_and_nothing_is_written(): void
    {
        $this->writer()->assign($this->plan->assignmentIdentity(), $this->other);
        $before = AssignmentRecord::query()->pluck('id')->sort()->values()->all();

        $this->assertThrows(fn () => $this->writer()->assignUnfinished($this->builder, fn () => $this->group()), AssignmentConflict::class);

        $this->assertSame($before, AssignmentRecord::query()->pluck('id')->sort()->values()->all());
    }

    public function test_a_finished_root_a_missing_record_or_a_group_too_large_is_refused_before_anything_changes(): void
    {
        $this->assertThrows(fn () => $this->writer()->assignUnfinished($this->builder, fn () => new AssignmentGroup($this->finished->assignmentIdentity(), [$this->open->assignmentIdentity()])), AssignmentRootFinished::class);
        $this->assertThrows(fn () => $this->writer()->assignUnfinished($this->builder, fn () => new AssignmentGroup($this->plan->assignmentIdentity(), [$this->open->assignmentIdentity(), new RecordIdentity('tasks.task', 999999)])), RecordUnavailable::class);
        $this->assertThrows(fn () => $this->writer()->assignUnfinished($this->builder, fn () => new AssignmentGroup($this->plan->assignmentIdentity(), array_map(fn (int $id) => new RecordIdentity('tasks.task', $id), range(1, 1000)))), AssignmentGroupTooLarge::class);

        $this->assertTrue($this->holderOf($this->open->assignmentIdentity())->isSameAs($this->other));
        $this->assertSame(2, AssignmentRecord::query()->count());
    }

    public function test_a_deliberate_reassignment_needs_the_roots_reference_and_releasing_clears_the_unfinished(): void
    {
        $root = $this->writer()->assignUnfinished($this->builder, fn () => $this->group())->outcomes[0]->current->get();

        $this->assertThrows(fn () => $this->writer()->reassignUnfinished(new AssignmentReference(999999, $this->builder), $this->other, fn () => $this->group()), AssignmentConflict::class);

        $released = $this->writer()->unassignUnfinished($root->reference, fn () => $this->group());

        $this->assertCount(3, $released->changes);
        $this->assertSame(1, AssignmentRecord::query()->count());
        $this->assertTrue($this->holderOf($this->finished->assignmentIdentity())->isSameAs($this->other));
    }

    private function group(): AssignmentGroup
    {
        return new AssignmentGroup($this->plan->assignmentIdentity(), [
            $this->open->assignmentIdentity(),
            $this->finished->assignmentIdentity(),
            $this->unheld->assignmentIdentity(),
        ]);
    }

    private function holderOf(RecordIdentity $record): ActorIdentity
    {
        $row = AssignmentRecord::query()->where('record_type', $record->type)->where('record_id', $record->id)->sole();

        return $row->toAssignment()->holder();
    }

    private function writer(): AssignmentWriter
    {
        return $this->app->make(AssignmentWriter::class);
    }
}
