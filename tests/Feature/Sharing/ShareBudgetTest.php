<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Reads\Contracts\ReadMeter;
use App\Reads\Support\ScopedReadMeter;
use App\Sharing\Exceptions\ShareBudgetExceeded;
use App\Sharing\Support\ShareBudget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The share budget: queries are counted through the read meter for the work each budget runs, bytes, records, links,
 * hops and time are charged against their limits, an exact limit passes and one more is a named refusal.
 */
final class ShareBudgetTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_read_budget_allows_32_queries_and_refuses_the_33rd(): void
    {
        $meter = $this->app->make(ScopedReadMeter::class);
        $budget = ShareBudget::forRead($meter);
        $runQueries = fn (int $count) => $meter->withinSchedule('one query per budgeted call', function () use ($budget, $count): void {
            for ($query = 1; $query <= $count; $query++) {
                $budget->run(fn () => DB::select('select 1'));
            }
        });

        $runQueries(32);

        $this->assertSame(32, $budget->queries());
        $this->expectExceptionObject(ShareBudgetExceeded::forQueries(32));

        $runQueries(1);
    }

    public function test_two_budgets_count_their_own_work_and_nested_work_counts_in_both(): void
    {
        $meter = $this->app->make(ReadMeter::class);
        $first = ShareBudget::forRead($meter);
        $second = ShareBudget::forRead($meter);

        $first->run(fn () => DB::select('select 1'));
        $second->run(fn () => DB::select('select 2'));
        $first->run(fn () => $second->run(fn () => DB::select('select 3')));

        $this->assertSame(2, $first->queries());
        $this->assertSame(2, $second->queries());
    }

    public function test_loaded_bytes_count_text_and_metadata_apart_under_one_limit(): void
    {
        $budget = ShareBudget::forRead($this->app->make(ReadMeter::class));
        $budget->chargeText(3 * 1_048_576);
        $budget->chargeMetadata(1_048_576);

        $this->assertSame(3 * 1_048_576, $budget->textBytes());
        $this->assertSame(1_048_576, $budget->metadataBytes());
        $this->expectExceptionObject(ShareBudgetExceeded::forBytes('loaded records', 4 * 1_048_576));

        $budget->chargeMetadata(1);
    }

    public function test_rendered_output_records_links_and_hops_refuse_one_past_their_limit(): void
    {
        $read = ShareBudget::forRead($this->app->make(ReadMeter::class));
        $read->chargeRendered(2 * 1_048_576);
        $preview = ShareBudget::forPreview($this->app->make(ReadMeter::class));
        $preview->chargeRecords(1_000);
        $preview->chargeLinks(2_000);
        $preview->requireHops(4);

        $this->assertThrows(fn () => $read->chargeRendered(1), ShareBudgetExceeded::class, 'rendered output');
        $this->assertThrows(fn () => $preview->chargeRecords(1), ShareBudgetExceeded::class, '1000 records');
        $this->assertThrows(fn () => $preview->chargeLinks(1), ShareBudgetExceeded::class, '2000 links');
        $this->assertThrows(fn () => $preview->requireHops(5), ShareBudgetExceeded::class, '4 relations');
    }

    public function test_work_after_two_seconds_is_refused(): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:00'));
        $budget = ShareBudget::forPreview($this->app->make(ReadMeter::class));
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:02'));
        $budget->chargeRecords(1);
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:02.001'));

        $this->expectExceptionObject(ShareBudgetExceeded::forTime(2_000));

        $budget->chargeRecords(1);
    }
}
