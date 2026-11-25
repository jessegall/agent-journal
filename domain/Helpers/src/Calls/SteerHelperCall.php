<?php

declare(strict_types=1);

namespace Domain\Helpers\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Helpers\Data\HelperSteerData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Adds steering to a helper's live job, or keeps it when none is live.
 *
 * @implements JournalCall<HelperSteerData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/steer', 'POST', HelperSteerData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SteerHelperCall extends Data implements JournalCall
{
    public function __construct(
        public string $identityId,
        public string $text,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
