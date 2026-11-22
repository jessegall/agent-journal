<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use App\Values\CallAccepted;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Asks to change a report, which is always refused: a report is a snapshot of one moment.
 *
 * @implements JournalCall<CallAccepted>
 */
#[Endpoint('reports/edit', 'POST', CallAccepted::class, CallEffect::Read)]
final class EditReportCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
