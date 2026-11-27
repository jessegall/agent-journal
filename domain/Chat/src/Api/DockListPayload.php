<?php

declare(strict_types=1);

namespace Domain\Chat\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Support\DockProjection;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Lists the first placements of one of the calling agent's conversations, named or the only one it has.
 *
 * @implements ApiPayload<DockListData>
 */
#[Endpoint('chat/dock/list', 'POST', DockListData::class, ApiEffect::Read)]
final class DockListPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Min(1), Max(DockProjection::LARGEST_CARD_LIMIT)]
        public readonly int $limit = DockProjection::LARGEST_CARD_LIMIT,
        public readonly string|null $chat = null,
    ) {}
}
