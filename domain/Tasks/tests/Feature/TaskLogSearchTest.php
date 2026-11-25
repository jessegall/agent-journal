<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Enums\Search\SearchSurface;
use App\Support\ActorContext;
use App\Support\RecordSearch;
use App\Values\EmittedHit;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Support\Mcp\TaskLogReadResult;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskLogLocation;
use Tests\Support\CommitsHookRows;

/**
 * A log line hit opens at that line through tasks_log_read and in the inspector's Logs tab, a task hit and a log hit
 * of the same task both survive with their own labels, and lines appended mid-search force no restart.
 */
final class TaskLogSearchTest extends TestCase
{
    use CommitsHookRows;

    private const int PAGE_LIMIT = 10;

    private const string FIRST_LINE = 'Plain start.';

    private const string CRASH_LINE = 'Driver crashed at boot.';

    private const string LAST_LINE = 'Done.';

    private const string APPENDED_LINE = 'Driver again.';

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_log_entries',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_log_line_opens_at_its_line_and_task_and_log_hits_both_survive(): void
    {
        $task = $this->loggedTask();
        $hits = $this->hitsOfEveryPage('driver');

        $log = self::hitFrom($hits, 'tasks.log');
        $title = self::hitFrom($hits, 'tasks.task');

        $crash = TaskLogEntry::query()->where('task_id', $task->id)->where('text', self::CRASH_LINE)->sole();

        $this->assertStringContainsString((string) $task->number, $log->title);
        $this->assertStringEndsWith(TaskLogLocation::of($crash->line)->label(), $log->title);
        $this->assertNotSame($title->sourceLabel, $log->sourceLabel);
        $this->assertSame($task->id, $log->reference->id);
        $this->assertSame($task->id, $title->reference->id);
        $this->assertSame('tasks_log_read', $log->open->tool);

        $read = $this->app->make(TaskLogReadResult::class)->read(
            (string) $log->open->arguments['task_id'],
            (string) $log->open->arguments['entry_id'],
        )->structuredContent();

        $this->assertSame(self::CRASH_LINE, $read['entry']['text']);
        $this->assertSame([self::FIRST_LINE], array_column($read['before'], 'text'));

        $this->actingAs($this->journal->ownerUser())
            ->get("/tasks/{$task->number}?tab=logs&entry={$log->open->arguments['entry_id']}")
            ->assertOk()
            ->assertSee(self::CRASH_LINE);

        $this->actingAs($this->journal->ownerUser())
            ->get("/tasks/{$task->number}?tab=logs&entry=01arz3ndektsv4rrffq69g0000")
            ->assertOk()
            ->assertSee('"isSelectedGone":true', false);
    }

    public function test_lines_appended_mid_search_force_no_restart(): void
    {
        $task = $this->loggedTask();
        $owner = self::owner();
        $coordinator = $this->app->make(RecordSearch::class);
        $request = SearchRequest::parse(query: 'driver', within: 'tasks.log', limit: 1);

        $first = $coordinator->search($owner, $this->reader(), $request);
        $this->app->make(CommandBus::class)->run(new LogTaskRunCommand($task->id, 1, self::APPENDED_LINE));
        $this->assertNotNull($first->continuation);
        $resume = SearchRequest::parse(continuation: $first->continuation);
        $next = $coordinator->search($owner, $this->reader(), $resume);

        $this->assertNotSame('restart', $next->status->value);
        $this->assertNotContains(self::APPENDED_LINE, array_map(fn (EmittedHit $hit) => $hit->snippet, $next->hits));
        $this->assertSame(4, TaskLogEntry::query()->where('task_id', $task->id)->count());
    }

    private function loggedTask(): Task
    {
        $task = $this->tasks()->task('Driver work')->taskCalled('Driver work');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartTaskCommand($task->id));

        foreach ([
            self::FIRST_LINE,
            self::CRASH_LINE,
            self::LAST_LINE,
        ] as $text) {
            $bus->run(new LogTaskRunCommand($task->id, 1, $text));
        }

        return $task;
    }

    /**
     * Every hit the search shows, page after page, as a caller follows its continuations; a call asks each source
     * only a few times, so a search over every source can take several pages.
     *
     * @return list<EmittedHit>
     */
    private function hitsOfEveryPage(string $words): array
    {
        $coordinator = $this->app->make(RecordSearch::class);
        $answer = $coordinator->search(self::owner(), $this->reader(), SearchRequest::parse(query: $words));
        $hits = $answer->hits;

        for ($page = 1; $answer->continuation !== null && $page < self::PAGE_LIMIT; $page++) {
            $next = SearchRequest::parse(continuation: $answer->continuation);
            $answer = $coordinator->search(self::owner(), $this->reader(), $next);
            $hits = [...$hits, ...$answer->hits];
        }

        return $hits;
    }

    private function reader(): SearchReader
    {
        return new SearchReader(ActorContext::forUser($this->journal->ownerUser()->id), SearchSurface::Palette);
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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
