<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/read', 'POST', MessagesRead::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
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
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
