<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Approves running one exact line as a sample, issuing the permit to run it.
 *
 * @implements JournalCall<SampleApproved>
 */
#[Endpoint(
    'processes/requests/{commandRequest}/sample-approval',
    'POST',
    SampleApproved::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ApproveSampleCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        #[MapName('expected_revision'), Min(1)]
        public int $expectedRevision,
        #[MapName('command_digest'), Size(64)]
        public string $commandDigest,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
