<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
 * @implements JournalCall<RestoreChecked>
 */
#[Endpoint(
    'processes/runs/{processRun}/restore-check',
    'POST',
    RestoreChecked::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class CheckRestoredOutputCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('processRun')]
        public string $processRun,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
