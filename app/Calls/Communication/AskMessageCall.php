<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Sends a message that asks for an answer.
 *
 * @implements JournalCall<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/ask', 'POST', MessageNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AskMessageCall extends Data implements JournalCall
{
    public function __construct(
        public NewMessage $message,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
