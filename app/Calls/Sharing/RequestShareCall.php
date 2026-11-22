<?php

declare(strict_types=1);

namespace App\Calls\Sharing;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Data\Sharing\ShareProposalStatusData;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Proposes sharing a record; its owner approves it. The request key keeps a retry one proposal.
 *
 * @implements JournalCall<ShareProposalStatusData>
 */
#[Endpoint('sharing/request', 'POST', ShareProposalStatusData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RequestShareCall extends Data implements JournalCall
{
    public function __construct(
        #[Regex('/^[a-z][a-z-]*$/')]
        public string $alias,
        #[Regex('/^[1-9][0-9]{0,18}$/')]
        public string $number,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
