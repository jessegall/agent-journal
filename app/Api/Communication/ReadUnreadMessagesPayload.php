<?php

declare(strict_types=1);

namespace App\Api\Communication;

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
 * Reads the messages of your inboxes you have not read yet, oldest first, and records each read.
 *
 * @implements ApiPayload<UnreadMessages>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/read-unread', 'POST', UnreadMessages::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ReadUnreadMessagesPayload extends Data implements ApiPayload
{
    public function __construct(
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
