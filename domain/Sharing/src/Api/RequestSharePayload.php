<?php

declare(strict_types=1);

namespace Domain\Sharing\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Sharing\Data\ShareProposalStatusData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Proposes sharing a record; its owner approves it. The request key keeps a retry one proposal.
 *
 * @implements ApiPayload<ShareProposalStatusData>
 */
#[Endpoint('sharing/request', 'POST', ShareProposalStatusData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RequestSharePayload extends Data implements ApiPayload
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
