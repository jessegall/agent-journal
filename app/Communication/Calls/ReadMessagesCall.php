<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Marks messages of an inbox read.
 *
 * @implements JournalCall<MessagesRead>
 */
#[Endpoint('communication/read', 'POST', MessagesRead::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
#[MapName(SnakeCaseMapper::class)]
final class ReadMessagesCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        #[Size(26)]
        public string $inboxId,
        #[Min(1), Max(100)]
        public array $messageIds,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
