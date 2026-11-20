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
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Data\AskCard;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/** @implements JournalCall<AskCard> */
#[Endpoint('asks/make', 'POST', AskCard::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class MakeAskCall extends Data implements JournalCall
{
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Max(16000)]
        public readonly string $body,
        public readonly string|null $type = null,
    ) {}

    public function typeKey(): AskTypeKey|null
    {
        return $this->type === null ? null : AskTypeKey::from($this->type);
    }
}
