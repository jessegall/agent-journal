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
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Asks a question in a chat you are a member of, for one named member (type:id) or for anyone to answer.
 *
 * @implements JournalCall<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/chat/ask', 'POST', MessageNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AskChatQuestionCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public readonly string $inboxId,
        public readonly string $body,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        public readonly string|null $respondent = null,
        public readonly string|null $claimToken = null,
    ) {}
}
