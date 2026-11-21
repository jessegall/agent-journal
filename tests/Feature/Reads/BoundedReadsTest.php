<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use App\Reads\Exceptions\ModelReadAllRefused;
use App\Reads\Exceptions\ReadLimitInvalid;
use App\Reads\Exceptions\ReadLimitTooLarge;
use App\Reads\Exceptions\ReadReasonMissing;
use App\Reads\Exceptions\ReadShapeUnsupported;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;
use Tests\Support\CountsReads;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A plain read of a bounded model returns at most 50 rows, newest first; a larger read is named, counts and writes
 * cover every row, pages stay within 100 rows, and a scan goes through key batches.
 */
#[TimeLimit(seconds: 10, reason: 'It creates sixty numbered tasks.')]
final class BoundedReadsTest extends TestCase
{
    use CountsReads;
    use RefreshHookDatabase;

    /**
     * @var list<string>
     */
    private array $taskIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        for ($number = 1; $number <= 60; $number++) {
            $this->taskIds[] = Task::factory()->create(['title' => "Task {$number}"])->id;
        }
    }

    public function test_a_plain_read_returns_the_newest_fifty(): void
    {
        $tasks = Task::query()->get();

        $this->assertCount(50, $tasks);
        $this->assertSame(end($this->taskIds), $tasks->first()?->id);
    }

    public function test_a_larger_read_is_named(): void
    {
        $this->assertCount(55, Task::query()->limit(55)->get());
        $this->assertCount(60, Task::query()->readLimit(101)->get());
        $this->assertCount(60, Task::query()->readAll('every task of the test')->get());
        $this->assertCount(
            60,
            Task::query()->whereKey($this->taskIds)->readExactly(count($this->taskIds))->pluck('id'),
        );
    }

    public function test_a_read_limit_a_page_holds_is_refused_for_limit(): void
    {
        $this->expectExceptionObject(ReadLimitInvalid::withinPage(100, 100));

        Task::query()->readLimit(100);
    }

    public function test_an_exact_read_of_a_known_set_takes_any_size(): void
    {
        $this->assertCount(3, Task::query()->whereKey(array_slice($this->taskIds, 0, 3))->readExactly(3)->get());
    }

    public function test_reading_every_row_without_a_name_is_refused(): void
    {
        $this->assertThrows(fn () => Task::all(), ModelReadAllRefused::class);
    }

    public function test_a_plain_read_above_the_largest_page_is_refused(): void
    {
        $this->expectException(ReadLimitTooLarge::class);

        Task::query()->take(101)->get();
    }

    public function test_a_read_of_every_row_needs_a_reason(): void
    {
        $this->expectException(ReadReasonMissing::class);

        Task::query()->readAll(' ');
    }

    public function test_counts_and_writes_cover_every_row_and_load_no_model(): void
    {
        $counts = $this->readCounts(fn () => Task::query()->count());

        $this->assertSame(60, Task::query()->count());
        $this->assertSame(0, $counts->modelsLoaded);
        $this->assertSame(60, Task::query()->update(['title' => 'Renamed']));
    }

    public function test_a_page_counts_every_row_and_a_page_too_large_is_refused_before_a_query(): void
    {
        $page = Task::query()->paginate();

        $this->assertSame(60, $page->total());
        $this->assertCount(50, $page->items());

        $counts = $this->readCounts(
            fn () => $this->assertThrows(fn () => Task::query()->paginate(1_000_000), ValidationException::class),
        );
        $this->assertSame(0, $counts->queriesRun);
    }

    public function test_a_scan_reads_key_batches_and_stops_when_asked(): void
    {
        $sizes = [];
        Task::query()->readInChunks(25, function (Collection $batch) use (&$sizes): void {
            $sizes[] = $batch->count();
        });

        $first = [];
        Task::query()->readInChunks(25, function (Collection $batch) use (&$first): bool {
            $first[] = $batch->count();

            return false;
        });

        $this->assertSame([25, 25, 10], $sizes);
        $this->assertSame([25], $first);
    }

    public function test_the_framework_chunk_is_refused_with_the_replacement(): void
    {
        $this->expectException(ReadShapeUnsupported::class);

        Task::query()->chunk(10, fn () => null);
    }
}
