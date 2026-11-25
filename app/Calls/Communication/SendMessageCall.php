<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
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
 * @implements JournalCall<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/send', 'POST', MessageNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SendMessageCall extends Data implements JournalCall
{
    public function __construct(
        public NewMessage $message,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
