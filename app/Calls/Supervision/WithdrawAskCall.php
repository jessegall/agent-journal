<?php

declare(strict_types=1);

namespace App\Calls\Supervision;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Asks\AskCard;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<AskCard>
 */
#[Endpoint('asks/withdraw', 'POST', AskCard::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class WithdrawAskCall extends Data implements JournalCall
{
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Ulid]
        public readonly string $id,
    ) {}
}
