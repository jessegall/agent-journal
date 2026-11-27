<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ApiRefusal;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Asks the journal to admit one shell line through the one shell admission; the admission keeps its own repeat
 * check on the request key, so a lost answer asked again under the same key admits the line once.
 *
 * @implements ApiPayload<LineAdmitted>
 */
#[Endpoint(
    'processes/admit',
    'POST',
    LineAdmitted::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::Operation,
    refusals: [ApiRefusal::class],
)]
final class AdmitLinePayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(100_000)]
        public readonly string $line,
        public readonly ShellDialect $dialect,
        #[MapName('working_folder'), Max(4096)]
        public readonly string $workingFolder,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
