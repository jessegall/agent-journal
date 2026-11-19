<?php

declare(strict_types=1);

namespace App\Records\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Removes the link between two records; both records stay.
 *
 * @implements JournalCall<LinkChanged>
 */
#[Endpoint('links/remove', 'POST', LinkChanged::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RemoveLinkCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(64)]
        public string $source,
        #[Max(64)]
        public string $target,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
