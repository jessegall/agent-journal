<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\RecordIdentity;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;

/**
 * A task takes comments through Core's comments alone: one the caller may read gets a comment that its page reads
 * back, and a caller with no access writes nothing and sees nothing of the task.
 */
final class TaskCommentsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'comments',
        'users',
        'tasks',
        'agents',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
    }

    public function test_a_comment_on_a_task_is_read_back_on_its_page(): void
    {
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->journal->actAsUserId($this->owner->id);

        $this->app->make(CommandBus::class)->run(new PostCommentCommand(
            new RecordIdentity(Task::linkType(), $task->id),
            'Is the schema settled?',
            (string) Str::uuid(),
        ));

        $taskPage = $this->actingAs($this->owner)->get("/tasks/{$task->number}?tab=comments")->assertOk();

        $taskPage->assertInertia(fn (AssertableInertia $page) => $page
            ->where(
                'page.data.root.children.1.children.1.children.5.children.0.native.props.target',
                "task {$task->number}",
            )
            ->where(
                'page.data.root.children.1.children.1.children.5.children.0.native.props.comments.items.0.comment.body',
                'Is the schema settled?',
            ));
    }

    public function test_a_caller_with_no_access_writes_nothing_and_sees_nothing(): void
    {
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->journal->asGuest();

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new PostCommentCommand(
                new RecordIdentity(Task::linkType(), $task->id),
                'Sneaking in.',
                (string) Str::uuid(),
            )),
        );

        $this->get("/tasks/{$task->number}?tab=comments")->assertRedirect('/login');
        $this->assertDatabaseCount('comments', 0);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
