<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
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

    private const string UNBOUNDED_LIST = 'A list query reads more than a page and one row: ';

    private const string SELECT_EVERY_COLUMN = '/^select \\* from "document_revisions"/';

    private const string WIDE_LIST = 'A list query reads every revision column, bodies included: ';

    private const string INDEX_NAME = '"Index Name": "document_revisions_%s_search"';

    private const string SEQUENTIAL_SCAN = '"Node Type": "Seq Scan"';

    private const string SCANS_EVERY_REVISION = 'The text match scans every revision.';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        $bus = $this->app->make(CommandBus::class);

        foreach (range(1, 12) as $number) {
            $phrase = $number % 3 === 0 ? 'The retention window is thirty days.' : 'Nothing to find here.';

            $bus->run(
                new CreateDocumentCommand(
                    "Design {$number}",
                    "What design {$number} says",
                    <<<TEXT
                    # Design {$number}

                    {$phrase}

                    TEXT,
                ),
            );
        }

        foreach (range(1, 4) as $number) {
            $bus->run(
                new CreateReportCommand(
                    "Check {$number}",
                    "What check {$number} found",
                    <<<TEXT
                    # Check {$number}

                    The retention window held.

                    TEXT,
                ),
            );
        }
    }

    public function test_a_page_runs_the_same_number_of_queries_whatever_its_size(): void
    {
        $documents = $this->app->make(DocumentResolver::class);
        $reports = $this->app->make(ReportResolver::class);

        foreach ([
            'document list' => fn (int $size) => $documents->list(new DocumentFilters(perPage: $size)),
            'report list' => fn (int $size) => $reports->list(new DocumentFilters(perPage: $size)),
            'document search' => fn (int $size) => $documents->list(
                new DocumentFilters(query: 'retention window', perPage: $size),
            ),
        ] as $read => $page) {
            $this->assertSame(
                count($this->queriesOf(fn () => $page(2))),
                count($this->queriesOf(fn () => $page(10))),
                $read,
            );
        }
    }

    public function test_a_list_page_reads_one_row_past_its_size_and_no_body(): void
    {
        $documents = $this->app->make(DocumentResolver::class);
        $queries = $this->queriesOf(fn () => $documents->list(new DocumentFilters(perPage: 5)));

        $this->assertNotEmpty($queries);

        foreach ($queries as $query) {
            $this->assertTrue(
                self::isBounded($query),
                self::UNBOUNDED_LIST.$query['query'],
            );

            $this->assertDoesNotMatchRegularExpression(
                self::SELECT_EVERY_COLUMN,
                $query['query'],
                self::WIDE_LIST.$query['query'],
            );
        }
    }

    public function test_the_text_match_is_served_by_the_trigram_indexes(): void
    {
        $match = DocumentRevision::query()->whereNotNull('closed_at')->matchingText('retention window')->select('id');

        $plan = DB::transaction(function () use ($match): string {
            DB::statement('SET LOCAL enable_seqscan = off');

            return (string) DB::selectOne(
                'EXPLAIN (FORMAT JSON) '.$match->toSql(),
                $match->getBindings(),
            )->{'QUERY PLAN'};
        });

        foreach ([
            'title',
            'abstract',
            'body',
        ] as $column) {
            $this->assertStringContainsString(
                sprintf(self::INDEX_NAME, $column),
                $plan,
                $column,
            );
        }

        $this->assertStringNotContainsString(self::SEQUENTIAL_SCAN, $plan, self::SCANS_EVERY_REVISION);
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

        return array_values(
            array_map(
                fn (array $query) => [
                    'query' => (string) $query['query'],
                    'bindings' => (array) $query['bindings'],
                ],
                DB::getQueryLog(),
            ),
        );
    }
}
