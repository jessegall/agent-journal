<?php

declare(strict_types=1);

namespace Domain\Helpers\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * @implements ApiPayload<HelperJobNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/cancel', 'POST', HelperJobNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CancelHelperJobPayload extends Data implements ApiPayload
{
    public function __construct(
        public string $jobId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
