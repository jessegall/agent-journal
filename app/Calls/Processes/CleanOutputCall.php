<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
 * @implements JournalCall<OutputCleaned>
 */
#[Endpoint('processes/runs/clean', 'POST', OutputCleaned::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CleanOutputCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $runs
     */
    public function __construct(
        #[Min(1), Max(100)]
        public array $runs,
        public bool $preview,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
