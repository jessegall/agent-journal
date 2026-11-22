<?php

declare(strict_types=1);

namespace Domain\Helpers\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Helpers\Data\HelperJobNamed;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Cancels one of the caller's open helper jobs; the helper's workspace stays.
 *
 * @implements JournalCall<HelperJobNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/cancel', 'POST', HelperJobNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CancelHelperJobCall extends Data implements JournalCall
{
    public function __construct(
        public string $jobId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
