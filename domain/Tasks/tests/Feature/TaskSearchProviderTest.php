<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\ReadGrant;
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

/**
 * The title scan visits blocks of 32 ids tier by tier: a match only in the second block comes after a scanning
 * call, equal titles stay two hits, a miss reads one block per call, and a refresh answers only what still
 * matches inside the live grant.
 */
final class TaskSearchProviderTest extends TestCase
{
    private const string SOURCE_KEY = 'tasks.task';

    private const string ID_PREFIX = '01arz3ndektsv4rrffq69g';

    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    public function test_a_match_only_in_the_second_block_comes_after_a_scanning_call(): void
    {
        foreach (range(1, TaskSearchProvider::BLOCK_SIZE) as $index) {
            self::task($index, "Unrelated chore {$index}");
        }

        $match = self::task(TaskSearchProvider::BLOCK_SIZE + 1, 'Driver');
        $provider = $this->app->make(TaskSearchProvider::class);
        $query = self::query('driver', self::user());

        $first = $provider->search($query);
        $this->assertInstanceOf(ScanningOutcome::class, $first->outcome);
        $this->assertSame([], $first->hits);

        $second = $provider->search($query->from(self::nextWork($first)));
        $this->assertSame([$match->id], self::ids($second));
        $this->assertSame(ScoreTier::ExactTitle, $second->hits[0]->score);
    }

    public function test_two_tasks_with_identical_titles_both_appear(): void
    {
        $first = self::task(1, 'Rotate the keys');
        $second = self::task(2, 'Rotate the keys');

        $batch = $this->app->make(TaskSearchProvider::class)->search(self::query('rotate the keys', self::user()));

        $this->assertSame([$first->id, $second->id], self::ids($batch));
        $this->assertInstanceOf(MoreOutcome::class, $batch->outcome);
    }

    public function test_a_two_character_miss_reads_one_block_per_call(): void
    {
        foreach (range(1, TaskSearchProvider::BLOCK_SIZE * 2) as $index) {
            self::task($index, "Chore {$index}");
        }

        $provider = $this->app->make(TaskSearchProvider::class);
        $query = self::query('zq', self::user());
        $first = $provider->search($query);
        $position = self::nextWork($first);

        DB::enableQueryLog();
        $second = $provider->search($query->from($position));
        $log = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertInstanceOf(ScanningOutcome::class, $second->outcome);
        $this->assertCount(1, $log);
        $this->assertStringContainsString('limit '.TaskSearchProvider::BLOCK_SIZE, $log[0]['query']);
        $this->assertFalse(self::nextWork($second)->equals($position));
    }

    public function test_a_refresh_drops_a_revoked_task_and_keeps_an_edited_one_at_its_tier(): void
    {
        $kept = self::task(1, 'Deploy notes');
        $revoked = self::task(2, 'Deploy notes');
        $this->app->instance(ReadGrant::class, self::grantFor([$kept->id]));
        Task::query()->whereKey($kept->id)->update(['title' => 'Deploy notes for Friday']);

        $agent = new SearchReader(ActorContext::forAgent(self::AGENT_ID), SearchSurface::AgentTool);
        $refresh = self::query('deploy notes', $agent)->refreshing([
            new HitIdentity(self::SOURCE_KEY, Task::LINK_TYPE, $kept->id),
            new HitIdentity(self::SOURCE_KEY, Task::LINK_TYPE, $revoked->id),
        ]);

        $batch = $this->app->make(TaskSearchProvider::class)->search($refresh);

        $this->assertSame([$kept->id], self::ids($batch));
        $this->assertSame(ScoreTier::TitlePrefix, $batch->hits[0]->score);
        $this->assertSame('Deploy notes for Friday', $batch->hits[0]->snippet);
    }

    public function test_a_task_reference_comes_first_at_tier_500(): void
    {
        $task = self::task(1, 'Search through everything');

        $batch = $this->app->make(TaskSearchProvider::class)->search(self::query("task {$task->number}", self::user()));

        $this->assertSame([$task->id], self::ids($batch));
        $this->assertSame(ScoreTier::Reference, $batch->hits[0]->score);
        $this->assertSame("Task {$task->number} · Search through everything", $batch->hits[0]->title);
    }

    private static function task(int $index, string $title): Task
    {
        return Task::factory()->create(['id' => self::ID_PREFIX.sprintf('%04d', $index), 'title' => $title]);
    }

    private static function query(string $words, SearchReader $reader): SearchQuery
    {
        return new SearchQuery(
            $reader,
            SearchWords::fromInput($words),
            SearchScope::within(self::SOURCE_KEY),
            self::SOURCE_KEY,
            10,
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

    private static function nextWork(SearchBatch $batch): SourcePosition
    {
        self::assertInstanceOf(ScanningOutcome::class, $batch->outcome);

        return $batch->outcome->nextWork;
    }

    /**
     * @param  list<string>  $taskIds
     */
    private static function grantFor(array $taskIds): ReadGrant
    {
        return new readonly class($taskIds) implements ReadGrant
        {
            /**
             * @param  list<string>  $taskIds
             */
            public function __construct(private array $taskIds) {}

            public function allows(ReadRequest $request): bool
            {
                return $request->target !== null && in_array($request->target, $this->taskIds, true);
            }

            public function assertAllowed(ReadRequest $request): void
            {
                if (! $this->allows($request)) {
                    throw ReadGrantRefused::because('not granted');
                }
            }

            public function allowedTargets(string $name): AllowedNames
            {
                return AllowedNames::only($this->taskIds);
            }
        };
    }
}
