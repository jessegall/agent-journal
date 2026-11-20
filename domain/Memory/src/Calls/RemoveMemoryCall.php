<?php

declare(strict_types=1);

namespace Domain\Memory\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Removes a memory of the caller.
 *
 * @implements JournalCall<MemoryNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/remove', 'POST', MemoryNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RemoveMemoryCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $memoryId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
