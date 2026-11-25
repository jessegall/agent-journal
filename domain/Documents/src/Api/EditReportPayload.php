<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Values\ApiAccepted;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Asks to change a report, which is always refused: a report is a snapshot of one moment.
 *
 * @implements ApiPayload<ApiAccepted>
 */
#[Endpoint('reports/edit', 'POST', ApiAccepted::class, ApiEffect::Read)]
final class EditReportPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
