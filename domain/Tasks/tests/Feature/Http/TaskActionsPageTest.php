<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\Http;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;

/**
 * Start, block and cancel from the task page check the task's state, run and revision at commit: a stale cancel is
 * refused with the fresh state, a block from an older run is refused, a blank reason is a validation error on reason,
 * and the page says which actions the caller may take.
 */
final class TaskActionsPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string READER = 'page.data.root.children.1.children.1.children';

    private User $owner;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->task = Task::factory()->create(['title' => 'Prepare records']);
    }

    public function test_the_page_offers_start_and_a_start_and_block_go_through_the_task_page(): void
    {
        $offered = $this->actingAs($this->owner)->get("/tasks/{$this->task->number}")->assertOk();

        $offered->assertInertia(fn (AssertableInertia $page) => $page
            ->where(self::READER.'.3.children.0.key', 'start')
            ->where(self::READER.'.3.children.0.form.fixed.run', 0)
            ->where(self::READER.'.3.children.1.key', 'cancel'));

        $this->act('start')->assertStatus(303)->assertSessionHasNoErrors();
        $this->act('block', [
            'run' => 1,
            'reason' => '   ',
        ])->assertSessionHasErrors('reason');
        $this->act('block', [
            'run' => 1,
            'reason' => 'Waits for the schema.',
        ])->assertSessionHasNoErrors();

        $this->assertSame(TaskState::Blocked, $this->task->refresh()->state);
    }

    public function test_a_stale_cancel_is_refused_and_an_older_run_cannot_block(): void
    {
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartTaskCommand($this->task->id));
        $bus->run(new BlockTaskCommand($this->task->id, 1, 'Waits.'));
        $bus->run(new StartTaskCommand($this->task->id));

        $this->act('cancel', [
            'reason' => 'Dropped.',
            'revision' => 1,
            'run' => 1,
        ])->assertSessionHasErrors();
        $this->act('block', [
            'run' => 1,
            'reason' => 'From an older tab.',
        ])->assertSessionHasErrors();

        $this->assertSame([
            TaskState::Started,
            2,
        ], [
            $this->task->refresh()->state,
            $this->task->run_number,
        ]);
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    private function act(string $action, array $fields = []): TestResponse
    {
        return $this->actingAs($this->owner)->from("/tasks/{$this->task->number}")
            ->post("/tasks/{$this->task->number}/{$action}", $fields);
    }
}
