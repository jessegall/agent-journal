<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * What a library page costs, measured in ways that hold on any machine: the queries a page runs, the rows it may
 * read, and the plan Postgres chooses for it. Wall-clock time is left out, since it measures the machine.
 */
#[TimeLimit(seconds: 5, reason: 'It files sixteen records through the bus before it reads.')]
final class LibraryReadCostTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)), new TrustedEntryAuthority('test'));
        $bus = $this->app->make(CommandBus::class);

        foreach (range(1, 12) as $number) {
            $phrase = $number % 3 === 0 ? 'The retention window is thirty days.' : 'Nothing to find here.';
            $bus->run(new CreateDocument("Design {$number}", "What design {$number} says", "# Design {$number}\n\n{$phrase}\n"));
        }

        foreach (range(1, 4) as $number) {
            $bus->run(new CreateReport("Check {$number}", "What check {$number} found", "# Check {$number}\n\nThe retention window held.\n"));
        }
    }

    public function test_a_page_runs_the_same_number_of_queries_whatever_its_size(): void
    {
        $documents = $this->app->make(DocumentResolver::class);
        $reports = $this->app->make(ReportResolver::class);

        foreach ([
            'document list' => fn (int $size) => $documents->list(new DocumentFilters(perPage: $size)),
            'report list' => fn (int $size) => $reports->list(new DocumentFilters(perPage: $size)),
            'document search' => fn (int $size) => $documents->list(new DocumentFilters(query: 'retention window', perPage: $size)),
        ] as $read => $page) {
            $this->assertSame(count($this->queriesOf(fn () => $page(2))), count($this->queriesOf(fn () => $page(10))), "The {$read} runs more queries for a larger page.");
        }
    }

    public function test_a_list_page_reads_one_row_past_its_size_and_no_body(): void
    {
        $documents = $this->app->make(DocumentResolver::class);
        $queries = $this->queriesOf(fn () => $documents->list(new DocumentFilters(perPage: 5)));

        $this->assertNotEmpty($queries);

        foreach ($queries as $query) {
            $this->assertTrue(self::isBounded($query), 'A list query reads more than a page and one row: '.$query['query']);
            $this->assertDoesNotMatchRegularExpression('/^select \* from "document_revisions"/', $query['query'], 'A list query reads every revision column, bodies included: '.$query['query']);
        }
    }

    public function test_the_text_match_is_served_by_the_trigram_indexes(): void
    {
        $match = DocumentRevision::query()->whereNotNull('closed_at')->matchingText('retention window')->select('id');

        $plan = DB::transaction(function () use ($match): string {
            DB::statement('SET LOCAL enable_seqscan = off');

            return (string) DB::selectOne('EXPLAIN (FORMAT JSON) '.$match->toSql(), $match->getBindings())->{'QUERY PLAN'};
        });

        foreach (['title', 'abstract', 'body'] as $column) {
            $this->assertStringContainsString("\"Index Name\": \"document_revisions_{$column}_search\"", $plan, "The {$column} match is not served by its trigram index.");
        }

        $this->assertStringNotContainsString('"Node Type": "Seq Scan"', $plan, 'The text match scans every revision.');
    }

    /**
     * Whether a query reads at most a page of 5 and one row: a limit of 6 or less, or keys of at most 6 rows.
     *
     * @param  array{query: string, bindings: array<int, mixed>}  $query
     */
    private static function isBounded(array $query): bool
    {
        if (preg_match('/\blimit (\d+)\b/', $query['query'], $limit) === 1) {
            return (int) $limit[1] <= 6;
        }

        return str_contains($query['query'], ' in (') && count($query['bindings']) <= 6;
    }

    /**
     * The queries a read runs, each with its bindings.
     *
     * @param  callable(): mixed  $read
     * @return list<array{query: string, bindings: array<int, mixed>}>
     */
    private function queriesOf(callable $read): array
    {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $read();
        DB::disableQueryLog();

        return array_values(array_map(fn (array $query) => ['query' => (string) $query['query'], 'bindings' => (array) $query['bindings']], DB::getQueryLog()));
    }
}
