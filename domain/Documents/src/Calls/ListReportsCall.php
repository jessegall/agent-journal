<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Enums\AttentionFilter;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Lists reports by attention, one page or one search at a time.
 *
 * @implements JournalCall<PublicationList>
 */
#[Endpoint('reports/list', 'POST', PublicationList::class, CallEffect::Read)]
final class ListReportsCall extends Data implements JournalCall
{
    public function __construct(
        public AttentionFilter $attention = AttentionFilter::Active,
        #[Min(1)]
        public int $page = 1,
        #[Max(200)]
        public string|null $query = null,
        #[Ulid]
        public string|null $after = null,
    ) {}
}
