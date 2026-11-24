<?php

declare(strict_types=1);

namespace Domain\Helpers\Calls;

use App\Attributes\Endpoint;
use App\Attributes\PresentList;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\DriverType;
use App\Enums\ReceiptOwner;
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
 * Starts a helper for work: an existing helper that fits, or a new one; the model is named every time.
 *
 * @implements JournalCall<HelperReceiptData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/start', 'POST', HelperReceiptData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class StartHelperCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $sourceSubjects
     */
    public function __construct(
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
        public bool $independent = false,
        public DriverType|null $driverType = null,
    ) {}
}
