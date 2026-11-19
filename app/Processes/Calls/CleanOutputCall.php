<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
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
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
