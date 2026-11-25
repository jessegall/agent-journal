<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use Domain\Documents\Data\RecordInspection;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads who edits a report, its attention, settlements, links and closes.
 *
 * @implements JournalCall<RecordInspection>
 */
#[Endpoint('reports/inspect', 'POST', RecordInspection::class, CallEffect::Read)]
final class InspectReportCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
