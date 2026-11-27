<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Lists one page of a document's revisions.
 *
 * @implements ApiPayload<RevisionList>
 */
#[Endpoint('docs/revisions', 'POST', RevisionList::class, ApiEffect::Read)]
final class ListDocumentRevisionsPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public readonly string $number,
        #[Min(1)]
        public readonly int $page = 1,
    ) {}
}
