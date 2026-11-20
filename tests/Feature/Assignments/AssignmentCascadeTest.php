<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentReference;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
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

    private AssigneeIdentity $builder;

    private AssigneeIdentity $other;

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
        $this->builder = AssigneeIdentity::of(Agent::create('Builder', 'read-only-helper'));
        $this->other = AssigneeIdentity::of(Agent::create('Other', 'read-only-helper'));
        $this->plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $this->open = Task::factory()->create(['title' => 'Open']);
        $this->finished = Task::factory()->create(['title' => 'Finished']);
        $this->unheld = Task::factory()->create(['title' => 'Unheld']);
        $this->writer()->assign($this->open->assignmentIdentity(), $this->other);
        $this->writer()->assign($this->finished->assignmentIdentity(), $this->other);
        $this->finished->finish('Done.');
    }

    public function test_the_root_and_every_unfinished_record_go_to_the_recipient_and_finished_ones_are_skipped(): void
    {
        $result = $this->writer()->assignUnfinished($this->builder, fn () => $this->group());

        $this->assertSame(
            [
                AssignmentOutcomeType::Changed,
                AssignmentOutcomeType::Changed,
                AssignmentOutcomeType::SkippedFinished,
                AssignmentOutcomeType::Changed,
            ],
            array_map(fn ($outcome) => $outcome->type, $result->outcomes),
        );
        $this->assertCount(3, $result->changes);
        $this->assertTrue($this->holderOf($this->open->assignmentIdentity())->isSameAs($this->builder));
        $this->assertTrue($this->holderOf($this->finished->assignmentIdentity())->isSameAs($this->other));
    }

    public function test_a_root_held_by_another_is_refused_and_nothing_is_written(): void
    {
        $this->writer()->assign($this->plan->assignmentIdentity(), $this->other);
        $before = AssignmentRecord::query()->pluck('id')->sort()->values()->all();

        $this->assertThrows(
            fn () => $this->writer()->assignUnfinished($this->builder, fn () => $this->group()),
            AssignmentConflict::class,
        );

        $this->assertSame($before, AssignmentRecord::query()->pluck('id')->sort()->values()->all());
    }

    public function test_a_finished_root_a_missing_record_or_a_too_large_group_is_refused_unchanged(): void
    {
        $this->assertThrows(
            fn () => $this->writer()->assignUnfinished(
                $this->builder,
                fn () => new AssignmentGroup(
                    $this->finished->assignmentIdentity(),
                    [$this->open->assignmentIdentity()],
                ),
            ),
            AssignmentRootFinished::class,
        );
        $this->assertThrows(
            fn () => $this->writer()->assignUnfinished(
                $this->builder,
                fn () => new AssignmentGroup(
                    $this->plan->assignmentIdentity(),
                    [$this->open->assignmentIdentity(), TestActors::record('tasks.task', 999999)],
                ),
            ),
            RecordUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->writer()->assignUnfinished(
                $this->builder,
                fn () => new AssignmentGroup(
                    $this->plan->assignmentIdentity(),
                    array_map(fn (int $number) => TestActors::record('tasks.task', $number), range(1, 1000)),
                ),
            ),
            AssignmentGroupTooLarge::class,
        );

        $this->assertTrue($this->holderOf($this->open->assignmentIdentity())->isSameAs($this->other));
        $this->assertSame(2, AssignmentRecord::query()->count());
    }

    public function test_a_deliberate_reassignment_needs_the_roots_reference_and_releasing_clears_the_unfinished(): void
    {
        $root = $this->writer()->assignUnfinished($this->builder, fn () => $this->group())->outcomes[0]->current;

        $this->assertThrows(
            fn () => $this->writer()->reassignUnfinished(
                new AssignmentReference(TestIds::of(999999), $this->builder),
                $this->other,
                fn () => $this->group(),
            ),
            AssignmentConflict::class,
        );

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

    private function holderOf(RecordIdentity $record): AssigneeIdentity
    {
        $row = AssignmentRecord::query()->where('record_type', $record->type)->where('record_id', $record->id)->sole();

        return $row->toAssignment()->holder();
    }

    private function writer(): AssignmentWriter
    {
        return $this->app->make(AssignmentWriterInTransaction::class);
    }
}
