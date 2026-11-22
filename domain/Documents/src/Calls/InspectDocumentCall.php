<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Domain\Documents\Data\RecordInspection;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads who edits a document, its attention, settlements, links and closes.
 *
 * @implements JournalCall<RecordInspection>
 */
#[Endpoint('docs/inspect', 'POST', RecordInspection::class, CallEffect::Read)]
final class InspectDocumentCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
