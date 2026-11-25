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
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Checks a run's restored output against what was recorded, part by part.
 *
 * @implements ApiPayload<RestoreChecked>
 */
#[Endpoint(
    'processes/runs/{processRun}/restore-check',
    'POST',
    RestoreChecked::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class CheckRestoredOutputPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameter('processRun')]
        public string $processRun,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
