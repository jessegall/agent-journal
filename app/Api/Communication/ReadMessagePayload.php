<?php

declare(strict_types=1);

namespace App\Api\Communication;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Data\Messages\MessageView;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Reads one message of an inbox you are attached to, and records that you read it.
 *
 * @implements ApiPayload<MessageView>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/read', 'POST', MessageView::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ReadMessagePayload extends Data implements ApiPayload
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
