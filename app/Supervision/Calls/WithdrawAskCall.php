<?php

declare(strict_types=1);

namespace App\Supervision\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Supervision\Data\AskCard;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/** @implements JournalCall<AskCard> */
#[Endpoint('asks/withdraw', 'POST', AskCard::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class WithdrawAskCall extends Data implements JournalCall
{
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Ulid]
        public readonly string $id,
    ) {}
}
