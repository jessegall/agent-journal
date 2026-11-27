<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Enums\AttentionFilter;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Lists documents by attention, one page or one search at a time.
 *
 * @implements ApiPayload<PublicationList>
 */
#[Endpoint('docs/list', 'POST', PublicationList::class, ApiEffect::Read)]
final class ListDocumentsPayload extends Data implements ApiPayload
{
    public function __construct(
        public readonly AttentionFilter $attention = AttentionFilter::Active,
        #[Min(1)]
        public readonly int $page = 1,
        #[Max(200)]
        public readonly string|null $query = null,
        public readonly bool $revisions = false,
        #[Ulid]
        public readonly string|null $after = null,
    ) {}
}
