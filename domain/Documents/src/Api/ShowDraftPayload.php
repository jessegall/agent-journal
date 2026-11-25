<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Domain\Documents\Data\DraftView;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads the caller's open draft of a document.
 *
 * @implements ApiPayload<DraftView>
 */
#[Endpoint('docs/draft', 'POST', DraftView::class, ApiEffect::Read)]
final class ShowDraftPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
