<?php

declare(strict_types=1);

namespace Domain\Chat\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Chat\Data\DockAnswerData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Undocks one placement from one of the calling agent's conversations, named or the only one it has.
 *
 * @implements ApiPayload<DockAnswerData>
 */
#[Endpoint('chat/dock/remove', 'POST', DockAnswerData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class DockRemovePayload extends Data implements ApiPayload
{
    public function __construct(
        public readonly string $placement,
        public readonly string|null $chat,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
