<?php

declare(strict_types=1);

namespace Tests\Measurements;

use App\Enums\SearchStatus;
use App\Enums\SearchSurface;
use App\Mcp\Support\ToolArguments;
use App\Support\ActorContext;
use App\Support\SearchCoordinator;
use App\Support\SearchDiagnostics;
use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Search\CollectingLogger;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Measures the Tasks search over the million-task corpus, outside the ordinary suites: run it by its path. Each
 * scenario is searched cold and warm, counting calls, time to the first certified hit or to a proven miss, time
 * through the open, rows and bytes per source, and the plan of its tier query, and prints the numbers as JSON.
 */
#[TimeLimit(seconds: 1500, reason: 'It seeds a million tasks once, then measures each scenario cold and warm.')]
final class TaskSearchMeasurement extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const array SCENARIOS = [
        'rare late hit' => 'zephyr audit',
        'common two-character prefix' => 're',
        'internal two-character substring' => 'ig',
        'genuine miss' => 'xylophone quartz',
        'prefix on the earliest candidate' => 'ledger r',
    ];

    private const int CALL_LIMIT = 50;

    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    public function test_measure_the_tasks_provider_on_a_million_tasks(): void
    {
        if (Task::query()->count() < SearchCorpusSeeder::TASK_COUNT) {
            $this->app->make(SearchCorpusSeeder::class)->run();
        }

        DB::statement('ANALYZE tasks');
        $this->startTestAgentRequest(1, 1);
        $measurements = [];

        foreach (self::SCENARIOS as $name => $words) {
            $measurements[$name] = [
                'cold' => $this->measure($words),
                'warm' => $this->measure($words),
                'plan' => $this->planOf($words),
            ];
        }

        $direct = Task::factory()->create(['title' => 'Direct reference target']);
        $measurements['direct reference'] = ['cold' => $this->measure("task {$direct->number}")];

        echo json_encode($measurements, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)."\n";

        $this->addToAssertionCount(1);
    }

    /**
     * @return array<string, mixed>
     */
    private function measure(string $words): array
    {
        $log = new CollectingLogger();
        $this->app->instance(SearchDiagnostics::class, new SearchDiagnostics($log));
        $coordinator = $this->app->make(SearchCoordinator::class);
        $user = ActorContext::forUser(self::AGENT_ID);
        $owner = new SearchOwner('measure', $user, '', 'search', SearchSurface::Palette);
        $reader = new SearchReader($user, SearchSurface::Palette);

        $started = hrtime(true);
        $answer = $coordinator->search($owner, $reader, SearchRequest::parse(query: $words));
        $calls = 1;

        while (self::keepsGoing($answer) && $calls < self::CALL_LIMIT) {
            $next = SearchRequest::parse(continuation: $answer->continuation);
            $answer = $coordinator->search($owner, $reader, $next);
            $calls++;
        }

        $toAnswer = (hrtime(true) - $started) / 1_000_000;
        $first = $answer->directOpen ?? ($answer->hits[0] ?? null);
        $toOpen = null;

        if ($first !== null) {
            $this->app->make(TaskReadResult::class)->read($first->reference->id, ToolArguments::fromPageFilters([]));
            $toOpen = (hrtime(true) - $started) / 1_000_000;
        }

        return [
            'status' => $answer->status->value,
            'calls' => $calls,
            'ms_to_first_hit_or_end' => round($toAnswer, 1),
            'ms_through_open' => $toOpen === null ? null : round($toOpen, 1),
            'rows_examined' => self::total($log, 'rows_examined'),
            'bytes_read' => self::total($log, 'bytes_read'),
        ];
    }

    private static function total(CollectingLogger $log, string $field): int
    {
        return (int) array_sum(array_map(fn (array $line) => $line['context'][$field] ?? 0, $log->lines));
    }

    private static function keepsGoing(SearchAnswer $answer): bool
    {
        return $answer->hits === [] && $answer->directOpen === null && $answer->status->continues()
            && $answer->status !== SearchStatus::Complete;
    }

    /**
     * @return list<string>
     */
    private function planOf(string $words): array
    {
        $rows = DB::select(
            'EXPLAIN (ANALYZE, BUFFERS) SELECT id, number, title FROM tasks WHERE title ILIKE ? ORDER BY id LIMIT 32',
            ['%'.addcslashes($words, '%_\\').'%'],
        );

        return array_map(fn (object $row): string => (string) current((array) $row), $rows);
    }
}
