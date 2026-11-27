<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Domain\Documents\Data\RevisionView;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads one revision of a document whole.
 *
 * @implements ApiPayload<RevisionView>
 */
#[Endpoint('docs/revision', 'POST', RevisionView::class, ApiEffect::Read)]
final class ShowDocumentRevisionPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public readonly string $number,
        #[Min(1)]
        public readonly int $revision,
    ) {}
}
