<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
 * @implements ApiPayload<MemoryNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/remove', 'POST', MemoryNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RemoveMemoryPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public string $memoryId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
