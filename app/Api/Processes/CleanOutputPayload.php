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
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Removes the stored output of ended runs, or only lists what it would remove.
 *
 * @implements ApiPayload<OutputCleaned>
 */
#[Endpoint('processes/runs/clean', 'POST', OutputCleaned::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CleanOutputPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $runs
     */
    public function __construct(
        #[Min(1), Max(100)]
        public array $runs,
        public bool $isPreview,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
