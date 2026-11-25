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
use Domain\Memory\Models\Memory;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Saves a memory for the caller, weighed by how long it must last.
 *
 * @implements ApiPayload<MemoryNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/save', 'POST', MemoryNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SaveMemoryPayload extends Data implements ApiPayload
{
    public function __construct(
        public string $text,
        #[Min(Memory::LIGHTEST), Max(Memory::HEAVIEST)]
        public int $weight,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
