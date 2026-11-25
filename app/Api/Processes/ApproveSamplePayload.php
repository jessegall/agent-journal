<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
 * @implements ApiPayload<SampleApproved>
 */
#[Endpoint(
    'processes/requests/{commandRequest}/sample-approval',
    'POST',
    SampleApproved::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ApproveSamplePayload extends Data implements ApiPayload
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
