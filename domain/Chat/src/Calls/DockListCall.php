<?php

declare(strict_types=1);

namespace Domain\Chat\Calls;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Support\DockProjection;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Lists the first placements of one of the calling agent's conversations, named or the only one it has.
 *
 * @implements JournalCall<DockListData>
 */
#[Endpoint('chat/dock/list', 'POST', DockListData::class, CallEffect::Read)]
final class DockListCall extends Data implements JournalCall
{
    public function __construct(
        #[Min(1), Max(DockProjection::LARGEST_CARD_LIMIT)]
        public int $limit = DockProjection::LARGEST_CARD_LIMIT,
        public string|null $chat = null,
    ) {}
}
