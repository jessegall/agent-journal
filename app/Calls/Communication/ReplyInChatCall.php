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
 * Replies to a chat message in the chat it was posted in.
 *
 * @implements JournalCall<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/chat/reply', 'POST', MessageNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ReplyInChatCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public readonly string $parentId,
        public readonly string $body,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        public readonly string|null $inboxId = null,
        public readonly string|null $claimToken = null,
    ) {}
}
