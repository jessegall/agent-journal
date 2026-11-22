<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\CommandBus;
use App\Enums\SearchSurface;
use App\Support\ActorContext;
use App\Support\SearchCoordinator;
use App\Values\EmittedHit;
use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Support\Mcp\TaskLogReadResult;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A log line hit opens at that line through tasks_log_read and in the inspector's Logs tab, a task hit and a log hit
 * of the same task both survive with their own labels, and lines appended mid-search force no restart.
 */
final class TaskLogSearchTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users', 'tasks', 'task_runs', 'task_history', 'task_log_entries', 'agents', 'agent_sessions', 'agent_stacks',
        'assignments', 'claim_authorizations', 'command_receipts',
    ];

    public function test_a_log_line_opens_at_its_line_and_task_and_log_hits_both_survive(): void
    {
        $task = $this->loggedTask();
        $answer = $this->search('driver');

        $log = self::hitFrom($answer->hits, 'tasks.log');
        $title = self::hitFrom($answer->hits, 'tasks.task');

        $this->assertSame("Task {$task->number} · Run 1, line 2", $log->title);
        $this->assertSame('Task log lines', $log->sourceLabel);
        $this->assertSame('Tasks', $title->sourceLabel);
        $this->assertSame($task->id, $log->reference->id);
        $this->assertSame($task->id, $title->reference->id);
        $this->assertSame('tasks_log_read', $log->open->tool);

        $read = $this->app->make(TaskLogReadResult::class)->read(
            (string) $log->open->arguments['task_id'],
            (string) $log->open->arguments['entry_id'],
        )->structuredContent();

        $this->assertSame('Driver crashed at boot.', $read['entry']['text']);
        $this->assertSame(['Plain start.'], array_column($read['before'], 'text'));

        $this->actingAs($this->owner)
            ->get("/tasks/{$task->number}?tab=logs&entry={$log->open->arguments['entry_id']}")
            ->assertOk()
            ->assertSee('Driver crashed at boot.');

        $this->actingAs($this->owner)
            ->get("/tasks/{$task->number}?tab=logs&entry=01arz3ndektsv4rrffq69g0000")
            ->assertOk()
            ->assertSee('"selectedGone":true');
    }

    public function test_lines_appended_mid_search_force_no_restart(): void
    {
        $task = $this->loggedTask();
        $owner = self::owner();
        $coordinator = $this->app->make(SearchCoordinator::class);
        $request = SearchRequest::parse(query: 'driver', within: 'tasks.log', limit: 1);

        $first = $coordinator->search($owner, $this->reader(), $request);
        $this->app->make(CommandBus::class)->run(new LogTaskRunCommand($task->id, 1, 'Driver again.'));
        $this->assertNotNull($first->continuation);
        $resume = SearchRequest::parse(continuation: $first->continuation);
        $next = $coordinator->search($owner, $this->reader(), $resume);

        $this->assertNotSame('restart', $next->status->value);
        $this->assertNotContains('Driver again.', array_map(fn (EmittedHit $hit) => $hit->snippet, $next->hits));
        $this->assertSame(4, TaskLogEntry::query()->where('task_id', $task->id)->count());
    }

    private function loggedTask(): Task
    {
        $task = Task::factory()->create(['title' => 'Driver work']);
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartTaskCommand($task->id));

        foreach (['Plain start.', 'Driver crashed at boot.', 'Done.'] as $text) {
            $bus->run(new LogTaskRunCommand($task->id, 1, $text));
        }

        return $task;
    }

    private function search(string $words): SearchAnswer
    {
        return $this->app->make(SearchCoordinator::class)->search(
            self::owner(),
            $this->reader(),
            SearchRequest::parse(query: $words),
        );
    }

    private function reader(): SearchReader
    {
        return new SearchReader(ActorContext::forUser($this->owner->id), SearchSurface::Palette);
    }

    private static function owner(): SearchOwner
    {
        $user = ActorContext::forUser('01ARZ3NDEKTSV4RRFFQ69G5FZZ');

        return new SearchOwner('session', $user, '', 'search', SearchSurface::Palette);
    }

    /**
     * @param  list<EmittedHit>  $hits
     */
    private static function hitFrom(array $hits, string $sourceKey): EmittedHit
    {
        foreach ($hits as $hit) {
            if ($hit->sourceKey === $sourceKey) {
                return $hit;
            }
        }

        self::fail("No hit from {$sourceKey}.");
    }
}
