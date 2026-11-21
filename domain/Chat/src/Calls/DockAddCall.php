<?php

declare(strict_types=1);

namespace Domain\Chat\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Domain\Chat\Data\DockAnswerData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Docks a source in one of the calling agent's conversations, named or the only one it has.
 *
 * @implements JournalCall<DockAnswerData>
 */
#[Endpoint('chat/dock/add', 'POST', DockAnswerData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class DockAddCall extends Data implements JournalCall
{
    public function __construct(
        public string $type,
        public string $id,
        public string|null $chat,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
