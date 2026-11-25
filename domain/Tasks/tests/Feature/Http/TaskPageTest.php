<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Contracts\Work\AgentFocuses;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;

/**
 * A task's own page opens by its number with its state, its holder, its latest run, the agent whose focus it is in
 * and its brief, and an unknown number is not found.
 */
final class TaskPageTest extends TestCase
{
    use CommitsHookRows;

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
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    private const string READER = 'page.data.root.children.1.children.1.children';

    private const string LIST = 'page.data.root.children.1.children.0.children.1.children';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
    }

    public function test_the_facts_name_the_tasks_it_waits_for_and_holds_up_as_links(): void
    {
        $first = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $second = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->owner->id);
        $this->journal->run(new AddTaskWaitCommand($second->id, $first->id));

        $waiting = $this->actingAs($this->owner)->get("/tasks/{$second->number}")->assertOk();

        $waiting->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.4.rows.2.fact.pieces.0.label', (string) $first->number)
            ->where(self::READER.'.4.rows.2.fact.pieces.0.href', "/tasks/{$first->number}")
            ->where(self::READER.'.4.rows.3.value', 'None'));

        $holding = $this->actingAs($this->owner)->get("/tasks/{$first->number}")->assertOk();

        $holding->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.4.rows.3.fact.pieces.0.label', (string) $second->number));
    }

    public function test_the_waits_tab_lists_the_prerequisite_and_the_holder_both_ways(): void
    {
        $first = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $second = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->owner->id);
        $this->journal->run(new AddTaskWaitCommand($second->id, $first->id));

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
        $first = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $second = $this->tasks()->task('Publish records')->taskCalled('Publish records');

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
            ->post("/tasks/{$second->number}/waits/waive", [
                'prerequisite' => (string) $first->number,
                'reason' => ' ',
            ])
            ->assertSessionHasErrors();

        $this->app->make('auth')->forgetGuards();

        $this->post("/tasks/{$second->number}/waits/remove", ['prerequisite' => (string) $first->number])
            ->assertRedirect('/login');

        $this->assertSame(1, TaskWait::query()->count());
    }

    private static function key(): string
    {
        return (string) Str::uuid();
    }

    /**
     * A started task on its first run, put in the focus of a new agent of the given name.
     */
    private function focusedTask(string $agentName): Task
    {
        $agent = Agent::create($agentName, 'main-agent', $this->localProject());
        $task = Task::factory()->create([
            'status' => TaskStatus::Started,
            'run_number' => 1,
        ]);
        TaskRun::create($task, 1, ActorIdentity::ofClass(Agent::class, $agent->id));
        $this->app->make(AgentFocuses::class)->focus(ActorIdentity::ofClass(Agent::class, $agent->id), $task);

        return $task;
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
