<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Assignments\Support\AssigneeIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\AddTaskWait;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * A task's own page opens by its number with its state, its holder, its latest run and its brief, and an unknown
 * number is not found.
 */
final class TaskPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_a_task_opens_by_number_with_its_facts_and_brief(): void
    {
        $task = Task::factory()->create(['title' => 'Prepare records', 'brief' => "First part.\n\nSecond part."]);
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $task->assignmentIdentity(),
            AssigneeIdentity::of($this->owner),
        );

        $taskPage = $this->actingAs($this->owner)->get("/tasks/{$task->number}")->assertOk();
        $taskPage->assertInertia(fn (AssertableInertia $page) => $page
            ->component('tasks/TaskWindow')
            ->where('page.data.number', (string) $task->number)
            ->where('page.data.title', 'Prepare records')
            ->where('page.data.state', 'open')
            ->where('page.data.holder.name', $this->owner->name)
            ->missing('page.data.latestRun')
            ->missing('page.data.runningNow')
            ->where('page.data.brief', "First part.\n\nSecond part."));
    }

    public function test_the_waits_tab_lists_the_prerequisite_and_the_holder_both_ways(): void
    {
        $first = Task::factory()->create(['title' => 'Prepare records']);
        $second = Task::factory()->create(['title' => 'Publish records']);
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new AddTaskWait($second->id, $first->id, self::key()));

        $waiting = $this->actingAs($this->owner)->get("/tasks/{$second->number}?section=waits")->assertOk();
        $waiting->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.waits.waitsFor.0.number', (string) $first->number)
            ->where('page.data.waits.waitsFor.0.state', 'open')
            ->where('page.data.waits.waitsFor.0.isSatisfied', false)
            ->count('page.data.waits.holdsUp', 0));

        $holding = $this->actingAs($this->owner)->get("/tasks/{$first->number}?section=waits")->assertOk();
        $holding->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.waits.holdsUp.0.number', (string) $second->number));
    }

    public function test_an_editor_adds_a_prerequisite_from_the_page_and_a_cycle_or_a_missing_reason_is_refused(): void
    {
        $first = Task::factory()->create(['title' => 'Prepare records']);
        $second = Task::factory()->create(['title' => 'Publish records']);

        $offered = $this->actingAs($this->owner)->get("/tasks/{$second->number}?section=waits")->assertOk();
        $offered->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.waitActions.mayEdit', true)
            ->where('page.data.waitActions.mayWaive', true));

        $this->actingAs($this->owner)->from("/tasks/{$second->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$second->number}/waits", ['prerequisite' => (string) $first->number])
            ->assertStatus(303)
            ->assertSessionHasNoErrors();

        $holding = $this->actingAs($this->owner)->get("/tasks/{$first->number}?section=waits");
        $holding->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.waits.holdsUp.0.number', (string) $second->number));

        $this->actingAs($this->owner)->from("/tasks/{$first->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$first->number}/waits", ['prerequisite' => (string) $second->number])
            ->assertStatus(303)
            ->assertSessionHasErrors();

        $this->actingAs($this->owner)->from("/tasks/{$second->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$second->number}/waits/waive", ['prerequisite' => (string) $first->number, 'reason' => ' '])
            ->assertSessionHasErrors();

        $this->post("/tasks/{$second->number}/waits/remove", ['prerequisite' => (string) $first->number])
            ->assertRedirect('/login');
        $this->assertSame(1, TaskWait::query()->count());
    }

    public function test_an_empty_brief_stays_empty_and_an_unknown_number_is_not_found(): void
    {
        $task = Task::factory()->create(['brief' => '']);

        $emptyPage = $this->actingAs($this->owner)->get("/tasks/{$task->number}")->assertOk();
        $emptyPage->assertInertia(fn (AssertableInertia $page) => $page->where('page.data.brief', ''));

        $this->actingAs($this->owner)->get('/tasks/'.TestIds::of(999999))->assertNotFound();
    }

    private static function key(): string
    {
        return (string) Str::uuid();
    }
}
