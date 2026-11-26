<?php

declare(strict_types=1);

namespace App\Api\Api\Communication;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Sends a message into an inbox you are attached to, as a reply when it names the message it answers.
 *
 * @implements ApiPayload<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/send', 'POST', MessageNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SendMessagePayload extends Data implements ApiPayload
{
    public function __construct(
        public NewMessage $message,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
