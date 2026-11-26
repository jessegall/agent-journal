<?php

declare(strict_types=1);

namespace Domain\Helpers\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\PresentList;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * Gives new work to the one helper identity the caller names; the model is named every time.
 *
 * @implements ApiPayload<HelperReceiptData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/send', 'POST', HelperReceiptData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SendHelperPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $sourceSubjects
     */
    public function __construct(
        public string $identityId,
        public string $profileKey,
        public string $model,
        public string|null $driverKey,
        public string|null $subject,
        public string|null $purposeId,
        public string|null $purposeText,
        public string $brief,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[PresentList]
        public array $sourceSubjects = [],
        public bool $isIndependent = false,
    ) {}
}
