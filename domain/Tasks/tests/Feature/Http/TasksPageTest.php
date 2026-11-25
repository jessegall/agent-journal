<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Models\Access\User;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;

/**
 * The tasks window lists tasks by number with the holder filter applied in the database before the count and the
 * page, and reads the page's holders once whatever the page holds.
 */
final class TasksPageTest extends TestCase
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

    private const string CONTENT = 'page.data.root.children.1.children.0.children.1.children';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
    }

    public function test_the_tasks_page_lists_tasks_with_their_numbers(): void
    {
        $task = $this->tasks()->task('Write the reader')->taskCalled('Write the reader');

        $tasksPage = $this->actingAs($this->owner)->get('/tasks')->assertOk();

        $tasksPage->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where(self::CONTENT.'.0.rows.0.leading.0.text', (string) $task->number)
            ->where(self::CONTENT.'.0.rows.0.label', 'Write the reader')
            ->where(self::CONTENT.'.0.rows.0.trailing.0.key', 'state')
            ->where('page.data.root.children.0.children.1.text', '1'));
    }

    public function test_the_unassigned_filter_counts_and_pages_in_the_database(): void
    {
        $tasks = Task::factory()->count(25)->create()->all();
        $this->journal->actAsUserId($this->owner->id);
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign($tasks[0]->assignmentIdentity(), AssigneeIdentity::of($this->owner));
        $writer->assign($tasks[1]->assignmentIdentity(), AssigneeIdentity::of($this->owner));

        $unassigned = $this->actingAs($this->owner)->get('/tasks?holder=unassigned');

        $unassigned->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.0.children.1.text', '23')
            ->count(self::CONTENT.'.0.rows', 20)
            ->where(self::CONTENT.'.1.children.2.key', 'position')
            ->where(
                self::CONTENT.'.0.rows.0.leading.0.text',
                (string) $tasks[2]->number,
            ));

        $own = $this->actingAs($this->owner)->get('/tasks?holder=mine');

        $own->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.0.children.1.text', '2'));
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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
