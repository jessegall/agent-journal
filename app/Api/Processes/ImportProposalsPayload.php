<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Imports a file of rule declarations as proposals.
 *
 * @implements ApiPayload<ProposalsImported>
 */
#[Endpoint(
    'processes/proposals/import',
    'POST',
    ProposalsImported::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ImportProposalsPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(1_000_000)]
        public string $declarations,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
