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
use Domain\Memory\Models\Memory;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Changes a memory's text or weight, as the revision its caller read.
 *
 * @implements JournalCall<MemoryNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/edit', 'POST', MemoryNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditMemoryCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $memoryId,
        #[Min(1)]
        public int $revision,
        public string|null $text,
        #[Min(Memory::LIGHTEST), Max(Memory::HEAVIEST)]
        public int|null $weight,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
