<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Domain\Documents\Data\RecordInspection;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads who edits a report, its attention, settlements, links and closes.
 *
 * @implements ApiPayload<RecordInspection>
 */
#[Endpoint('reports/inspect', 'POST', RecordInspection::class, ApiEffect::Read)]
final class InspectReportPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
