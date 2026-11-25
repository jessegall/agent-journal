<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Authorization\ReadGrant;
use App\Enums\ScoreTier;
use App\Enums\SearchSurface;
use App\Exceptions\ReadGrantRefused;
use App\Support\ActorContext;
use App\Values\AllowedNames;
use App\Values\HitIdentity;
use App\Values\MoreOutcome;
use App\Values\ReadRequest;
use App\Values\ScanningOutcome;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\SourcePosition;
use App\Values\WorkBudget;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskSearchProvider;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;

/**
 * The title scan visits blocks of at most 32 tasks the tier's pattern matches, tier by tier: a match only in the
 * second block comes after a scanning call, equal titles stay two hits, a miss reads one block per call, and a
 * refresh answers only what still matches inside the live grant.
 */
final class TaskSearchProviderTest extends TestCase
{
    use RefreshHookDatabase;

    private const string EDITED_TITLE = 'Deploy notes for Friday';

    private const string SOURCE_KEY = 'tasks.task';

    private const string ID_PREFIX = '01arz3ndektsv4rrffq69g';

    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    public function test_a_match_only_in_the_second_block_comes_after_a_scanning_call(): void
    {
        foreach (range(1, TaskSearchProvider::BLOCK_ROW_LIMIT) as $index) {
            self::task($index, 'Driver');
        }

        $match = self::task(TaskSearchProvider::BLOCK_ROW_LIMIT + 1, 'Old driver');
        $provider = $this->app->make(TaskSearchProvider::class);
        $query = self::searchQuery('driver', self::user(), SearchQuery::HIT_LIMIT);
        $batch = $provider->search($query);
        $previous = null;

        for ($call = 0; $call < 10 && ! in_array($match->id, self::ids($batch), true); $call++) {
            $previous = $batch;
            $batch = $provider->search($query->from(self::nextOf($batch)));
        }

        $this->assertSame([$match->id], self::ids($batch));
        $this->assertSame(ScoreTier::TitleContains, $batch->hits[0]->score);
        $this->assertNotNull($previous);
        $this->assertInstanceOf(ScanningOutcome::class, $previous->outcome);
    }

    public function test_two_tasks_with_identical_titles_both_appear(): void
    {
        $first = self::task(1, 'Rotate the keys');
        $second = self::task(2, 'Rotate the keys');

        $query = self::searchQuery('rotate the keys', self::user());
        $batch = $this->app->make(TaskSearchProvider::class)->search($query);

        $this->assertSame([
            $first->id,
            $second->id,
        ], self::ids($batch));
        $this->assertInstanceOf(MoreOutcome::class, $batch->outcome);
    }

    public function test_a_two_character_miss_reads_one_block_per_call(): void
    {
        foreach (range(1, TaskSearchProvider::BLOCK_ROW_LIMIT * 2) as $index) {
            self::task($index, "Chore {$index}");
        }

        $provider = $this->app->make(TaskSearchProvider::class);
        $query = self::searchQuery('zq', self::user());
        $first = $provider->search($query);
        $position = self::nextWork($first);

        DB::enableQueryLog();
        $second = $provider->search($query->from($position));
        $log = DB::getQueryLog();
        DB::disableQueryLog();

        $isRead = fn (array $entry): bool => str_starts_with($entry['query'], 'select');
        $reads = array_values(array_filter($log, $isRead));

        $this->assertInstanceOf(ScanningOutcome::class, $second->outcome);
        $this->assertCount(1, $reads);
        $limitClause = '/\blimit\s+'.TaskSearchProvider::BLOCK_ROW_LIMIT.'\b/';
        $this->assertMatchesRegularExpression($limitClause, $reads[0]['query']);
        $this->assertFalse(self::nextWork($second)->equals($position));
    }

    public function test_a_refresh_drops_a_revoked_task_and_keeps_an_edited_one_at_its_tier(): void
    {
        $kept = self::task(1, 'Deploy notes');
        $revoked = self::task(2, 'Deploy notes');
        $this->app->instance(ReadGrant::class, self::grantFor([$kept->id]));
        Task::query()->whereKey($kept->id)->update(['title' => self::EDITED_TITLE]);

        $agent = new SearchReader(ActorContext::forAgent(self::AGENT_ID), SearchSurface::AgentTool);

        $refresh = self::searchQuery('deploy notes', $agent)->refreshing([
            new HitIdentity(self::SOURCE_KEY, Task::linkType(), $kept->id),
            new HitIdentity(self::SOURCE_KEY, Task::linkType(), $revoked->id),
        ]);

        $batch = $this->app->make(TaskSearchProvider::class)->search($refresh);

        $this->assertSame([$kept->id], self::ids($batch));
        $this->assertSame(ScoreTier::TitlePrefix, $batch->hits[0]->score);
        $this->assertSame(self::EDITED_TITLE, $batch->hits[0]->snippet);
    }

    public function test_a_task_reference_comes_first_at_tier_500(): void
    {
        $task = self::task(1, 'Search through everything');

        $query = self::searchQuery("task {$task->number}", self::user());
        $batch = $this->app->make(TaskSearchProvider::class)->search($query);

        $this->assertSame([$task->id], self::ids($batch));
        $this->assertSame(ScoreTier::Reference, $batch->hits[0]->score);
        $this->assertStringContainsString((string) $task->number, $batch->hits[0]->title);
        $this->assertStringEndsWith($task->title, $batch->hits[0]->title);
    }

    private static function task(int $index, string $title): Task
    {
        return Task::factory()->create([
            'id' => self::ID_PREFIX.sprintf('%04d', $index),
            'title' => $title,
        ]);
    }

    private static function searchQuery(string $words, SearchReader $reader, int $allowance = 10): SearchQuery
    {
        return new SearchQuery(
            $reader,
            SearchWords::fromInput($words),
            SearchScope::within(self::SOURCE_KEY),
            self::SOURCE_KEY,
            $allowance,
            WorkBudget::forBatch(150),
            null,
        );
    }

    private static function user(): SearchReader
    {
        return new SearchReader(ActorContext::forUser(self::AGENT_ID), SearchSurface::Palette);
    }

    /**
     * @return list<string>
     */
    private static function ids(SearchBatch $batch): array
    {
        return array_map(fn ($hit) => $hit->reference->id, $batch->hits);
    }

    private static function nextOf(SearchBatch $batch): SourcePosition
    {
        $outcome = $batch->outcome;

        if ($outcome instanceof MoreOutcome) {
            return $outcome->nextSeek;
        }

        return self::nextWork($batch);
    }

    private static function nextWork(SearchBatch $batch): SourcePosition
    {
        self::assertInstanceOf(ScanningOutcome::class, $batch->outcome);

        return $batch->outcome->nextWork;
    }

    /**
     * @param  list<string>  $ids
     */
    private static function grantFor(array $ids): ReadGrant
    {
        return new readonly class($ids) implements ReadGrant
        {
            /**
             * @param  list<string>  $ids
             */
            public function __construct(private array $ids) {}

            public function allows(ReadRequest $request): bool
            {
                return $request->target !== null && in_array($request->target, $this->ids, true);
            }

            public function assertAllowed(ReadRequest $request): void
            {
                if (! $this->allows($request)) {
                    throw ReadGrantRefused::because('not granted');
                }
            }

            public function allowedTargets(string $name): AllowedNames
            {
                return AllowedNames::only($this->ids);
            }
        };
    }
}
