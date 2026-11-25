<?php

declare(strict_types=1);

namespace Domain\Helpers\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Helpers\Data\HelperReceiptData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Continues a helper's unfinished job on the model the caller names now.
 *
 * @implements ApiPayload<HelperReceiptData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/continue', 'POST', HelperReceiptData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ContinueHelperPayload extends Data implements ApiPayload
{
    public function __construct(
        public string $identityId,
        public string $jobId,
        public string $model,
        public string|null $driverKey,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
