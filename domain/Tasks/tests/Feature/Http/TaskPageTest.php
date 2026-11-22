<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Support\AssigneeIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * A task's own page opens by its number with its state, its holder, its latest run and its brief, and an unknown
 * number is not found.
 */
final class TaskPageTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_waits',
        'task_wait_history',
        'task_history',
        'task_runs',
        'task_log_entries',
        'task_checks',
        'assignments',
        'agents',
        'command_receipts',
    ];

    private const string READER = 'page.data.root.children.1.children.1.children';

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
            ->component('layout/DeclaredLayout')
            ->where(self::READER.'.0.text', 'Prepare records')
            ->where(self::READER.'.1.children.0.text', "Task {$task->number}")
            ->where(self::READER.'.2.text', "First part.\n\nSecond part.")
            ->where(self::READER.'.4.rows.0.value', 'Open')
            ->where(self::READER.'.4.rows.1.value', fn (string $held) => str_contains($held, $this->owner->name))
            ->missing(self::READER.'.4.rows.2'));
    }

    public function test_the_waits_tab_lists_the_prerequisite_and_the_holder_both_ways(): void
    {
        $first = Task::factory()->create(['title' => 'Prepare records']);
        $second = Task::factory()->create(['title' => 'Publish records']);
        $this->startUserRequestAs($this->owner->id);
        $this->runOnBus(new AddTaskWaitCommand($second->id, $first->id));

        $waiting = $this->actingAs($this->owner)->get("/tasks/{$second->number}?section=waits")->assertOk();

        $waiting->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.5.children.0.native.props.waits.waitsFor.0.number', (string) $first->number)
            ->where(self::READER.'.5.children.0.native.props.waits.waitsFor.0.state', 'open')
            ->where(self::READER.'.5.children.0.native.props.waits.waitsFor.0.isSatisfied', false)
            ->count(self::READER.'.5.children.0.native.props.waits.holdsUp', 0));

        $holding = $this->actingAs($this->owner)->get("/tasks/{$first->number}?section=waits")->assertOk();

        $holding->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.5.children.0.native.props.waits.holdsUp.0.number', (string) $second->number));
    }

    public function test_an_editor_adds_a_prerequisite_from_the_page_and_a_cycle_or_a_missing_reason_is_refused(): void
    {
        $first = Task::factory()->create(['title' => 'Prepare records']);
        $second = Task::factory()->create(['title' => 'Publish records']);

        $offered = $this->actingAs($this->owner)->get("/tasks/{$second->number}?section=waits")->assertOk();

        $offered->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.5.children.0.native.props.actions.mayEdit', true)
            ->where(self::READER.'.5.children.0.native.props.actions.mayWaive', true));

        $this->actingAs($this->owner)->from("/tasks/{$second->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$second->number}/waits", ['prerequisite' => (string) $first->number])
            ->assertStatus(303)
            ->assertSessionHasNoErrors();

        $holding = $this->actingAs($this->owner)->get("/tasks/{$first->number}?section=waits");

        $holding->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.5.children.0.native.props.waits.holdsUp.0.number', (string) $second->number));

        $this->actingAs($this->owner)->from("/tasks/{$first->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$first->number}/waits", ['prerequisite' => (string) $second->number])
            ->assertStatus(303)
            ->assertSessionHasErrors();

        $this->actingAs($this->owner)->from("/tasks/{$second->number}")
            ->withHeader('Idempotency-Key', self::key())
            ->post("/tasks/{$second->number}/waits/waive", ['prerequisite' => (string) $first->number, 'reason' => ' '])
            ->assertSessionHasErrors();

        $this->app->make('auth')->forgetGuards();

        $this->post("/tasks/{$second->number}/waits/remove", ['prerequisite' => (string) $first->number])
            ->assertRedirect('/login');

        $this->assertSame(1, TaskWait::query()->count());
    }

    public function test_an_empty_brief_stays_empty_and_an_unknown_number_is_not_found(): void
    {
        $task = Task::factory()->create(['brief' => '']);

        $emptyPage = $this->actingAs($this->owner)->get("/tasks/{$task->number}")->assertOk();
        $emptyPage->assertInertia(fn (AssertableInertia $page) => $page->where(self::READER.'.2.text', ''));

        $this->actingAs($this->owner)->get('/tasks/'.TestIds::of(999999))->assertNotFound();
    }

    private static function key(): string
    {
        return (string) Str::uuid();
    }
}
