<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\CallAccepted;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Marks a report as needing no more attention, with the reason.
 *
 * @implements JournalCall<CallAccepted>
 */
#[Endpoint('reports/close', 'POST', CallAccepted::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SettleReportCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
        public string $reason,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
