<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\Reads\Contracts\ReadMeter as ReadMeterContract;
use App\Records\Exceptions\ShareBudgetExceeded;
use App\Sharing\Support\ShareBudget;
use Carbon\CarbonImmutable;
use Tests\Commands\Sharing\SharingTestCase;

/**
 * The share budget: queries are counted through the read meter for the work each budget runs, bytes, records, links,
 * hops and time are charged against their limits, an exact limit passes and one more is a named refusal.
 */
final class ShareBudgetTest extends SharingTestCase
{
    private const string RENDERED_OUTPUT = 'rendered output';

    public function test_loaded_bytes_count_text_and_metadata_apart_under_one_limit(): void
    {
        $budget = ShareBudget::forRead($this->app->make(ReadMeterContract::class));
        $budget->chargeText(3 * 1_048_576);
        $budget->chargeMetadata(str_repeat('m', 1_048_576));

        $this->assertSame(3 * 1_048_576, $budget->textBytes());
        $this->assertSame(1_048_576, $budget->metadataBytes());
        $this->expectExceptionObject(ShareBudgetExceeded::forBytes('loaded records', 4 * 1_048_576));

        $budget->chargeMetadata('m');
    }

    public function test_rendered_output_records_links_and_hops_refuse_one_past_their_limit(): void
    {
        $read = ShareBudget::forRead($this->app->make(ReadMeterContract::class));
        $read->chargeRendered(2 * 1_048_576);
        $preview = ShareBudget::forPreview($this->app->make(ReadMeterContract::class));
        $preview->chargeRecords(1_000);
        $preview->chargeLinks(2_000);
        $preview->assertHopsWithinBudget(4);

        $this->assertThrows(fn () => $read->chargeRendered(1), ShareBudgetExceeded::class, self::RENDERED_OUTPUT);
        $nodes = ShareBudgetExceeded::forNodes(1_000)->getMessage();
        $links = ShareBudgetExceeded::forLinks(2_000)->getMessage();
        $hops = ShareBudgetExceeded::forHops(4)->getMessage();

        $this->assertThrows(fn () => $preview->chargeRecords(1), ShareBudgetExceeded::class, $nodes);
        $this->assertThrows(fn () => $preview->chargeLinks(1), ShareBudgetExceeded::class, $links);
        $this->assertThrows(fn () => $preview->assertHopsWithinBudget(5), ShareBudgetExceeded::class, $hops);
    }

    public function test_work_after_two_seconds_is_refused(): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:00'));
        $budget = ShareBudget::forPreview($this->app->make(ReadMeterContract::class));
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:02'));
        $budget->chargeRecords(1);
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-18 12:00:02.001'));

        $this->expectExceptionObject(ShareBudgetExceeded::forTime(2_000));

        $budget->chargeRecords(1);
    }
}
