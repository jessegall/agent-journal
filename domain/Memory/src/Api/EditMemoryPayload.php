<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
 * @implements ApiPayload<MemoryNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/edit', 'POST', MemoryNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditMemoryPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public readonly string $memoryId,
        #[Min(1)]
        public readonly int $revision,
        public readonly string|null $text,
        #[Min(Memory::LIGHTEST), Max(Memory::HEAVIEST)]
        public readonly int|null $weight,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
