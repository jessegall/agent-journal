<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Assignments\Support\AssigneeIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * The tasks window lists tasks by number with the holder filter applied in the database before the count and the
 * page, and reads the page's holders once whatever the page holds.
 */
final class TasksPageTest extends TestCase
{
    use CommitsHookRows;
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

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_tasks_page_lists_tasks_with_their_numbers(): void
    {
        $task = Task::factory()->create(['title' => 'Write the reader']);

        $tasksPage = $this->actingAs($this->owner)->get('/tasks')->assertOk();

        $tasksPage->assertInertia(fn (AssertableInertia $page) => $page
            ->component('tasks/TasksWindow')
            ->where('page.data.rows.0.number', (string) $task->number)
            ->where('page.data.rows.0.title', 'Write the reader')
            ->where('page.data.rows.0.state', 'open')
            ->missing('page.data.rows.0.holder')
            ->where('page.data.pagination.total', 1));
    }

    public function test_the_unassigned_filter_counts_and_pages_in_the_database(): void
    {
        $tasks = Task::factory()->count(25)->create()->all();
        $this->startUserRequestAs($this->owner->id);
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign($tasks[0]->assignmentIdentity(), AssigneeIdentity::of($this->owner));
        $writer->assign($tasks[1]->assignmentIdentity(), AssigneeIdentity::of($this->owner));

        $unassigned = $this->actingAs($this->owner)->get('/tasks?holder=unassigned');

        $unassigned->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.pagination.total', 23)
            ->where('page.data.pagination.lastPage', 2)
            ->count('page.data.rows', 20)
            ->where('page.data.rows.0.number', (string) $tasks[2]->number)
            ->where('page.data.filters.holder', 'unassigned'));

        $mine = $this->actingAs($this->owner)->get('/tasks?holder=mine');

        $mine->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.pagination.total', 2)
            ->where('page.data.rows.0.holder.name', $this->owner->name));
    }

    public function test_holders_are_read_once_for_a_page_whatever_it_holds(): void
    {
        Task::factory()->count(3)->create();
        $small = $this->assignmentQueriesReading();

        Task::factory()->count(17)->create();
        $large = $this->assignmentQueriesReading();

        $this->assertSame($small, $large);
        $this->assertGreaterThan(0, $small);
    }

    private function assignmentQueriesReading(): int
    {
        $count = 0;

        DB::listen(function ($query) use (&$count): void {
            if (str_contains($query->sql, '"assignments"')) {
                $count++;
            }
        });

        $this->actingAs($this->owner)->get('/tasks')->assertOk();

        return $count;
    }
}
