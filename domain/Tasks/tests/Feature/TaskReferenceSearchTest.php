<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\ReadGrant;
use App\Enums\ScoreTier;
use App\Enums\SearchSurface;
use App\Support\ActorContext;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\WorkBudget;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskReferenceRecognizer;
use Domain\Tasks\Support\TaskSearchProvider;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Search\MutableReadGrant;
use Tests\Support\RefreshHookDatabase;

/**
 * A whole task reference is recognized without a read and found in one indexed statement through the numbering key;
 * an absent task and one the reader may not see give the same answer, and a bare number issues no query at all.
 */
final class TaskReferenceSearchTest extends TestCase
{
    use RefreshHookDatabase;

    private const string READER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    public function test_a_task_reference_is_found_by_one_indexed_read(): void
    {
        Task::factory()->create();
        $task = Task::factory()->create(['title' => 'Search through everything']);

        DB::enableQueryLog();
        $batch = $this->search("  TASK {$task->number} ", self::user());
        $lookups = array_filter(
            DB::getQueryLog(),
            fn (array $entry): bool => str_contains($entry['query'], 'number_group_id'),
        );
        DB::disableQueryLog();

        $this->assertCount(1, $lookups);
        $this->assertSame($task->id, $batch->hits[0]->reference->id);
        $this->assertSame(ScoreTier::Reference, $batch->hits[0]->score);
        $this->assertStringContainsString((string) $task->number, $batch->hits[0]->title);
        $this->assertStringEndsWith($task->title, $batch->hits[0]->title);
        $this->assertStringEndsWith((string) $task->number, $batch->hits[0]->snippet);
        $this->assertStringNotContainsString($task->title, $batch->hits[0]->snippet);
    }

    public function test_an_invisible_task_and_an_absent_one_give_the_same_answer(): void
    {
        $task = Task::factory()->create(['title' => 'Hidden']);
        $other = Task::factory()->create(['title' => 'Visible']);
        $this->app->instance(ReadGrant::class, new MutableReadGrant([$other->id]));
        $agent = new SearchReader(ActorContext::forAgent(self::READER_ID), SearchSurface::AgentTool);

        $invisible = $this->search("task {$task->number}", $agent);
        $absent = $this->search('task 999999', $agent);

        $this->assertSame([], $invisible->hits);
        $this->assertSame([], $absent->hits);
        $this->assertEquals($invisible->outcome::class, $absent->outcome::class);
    }

    public function test_a_bare_number_gets_a_hint_and_issues_no_query(): void
    {
        $recognizer = new TaskReferenceRecognizer();

        DB::enableQueryLog();
        $reference = $recognizer->recognize('7');
        $hint = $recognizer->hint('7');
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertNull($reference);
        $this->assertStringContainsString('task', $hint);
        $this->assertStringEndsWith('7', $hint);
        $this->assertSame(0, $queries);
    }

    public function test_only_the_whole_reference_is_recognized(): void
    {
        $recognizer = new TaskReferenceRecognizer();

        $this->assertNull($recognizer->recognize('task 2241 notes'));
        $this->assertNull($recognizer->recognize('plan 2241'));
        $this->assertNull($recognizer->recognize('task 02241'));
        $this->assertSame(2241, $recognizer->recognize('Task 2241')?->number);
        $this->assertNull($recognizer->hint('task 2241'));
    }

    private function search(string $words, SearchReader $reader): SearchBatch
    {
        return $this->app->make(TaskSearchProvider::class)->search(new SearchQuery(
            $reader,
            SearchWords::fromInput($words),
            SearchScope::within('tasks.task'),
            'tasks.task',
            10,
            WorkBudget::forBatch(150),
        ));
    }

    private static function user(): SearchReader
    {
        return new SearchReader(ActorContext::forUser(self::READER_ID), SearchSurface::Palette);
    }
}
