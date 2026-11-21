<?php

declare(strict_types=1);

namespace Domain\Helpers\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\PresentList;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Domain\Helpers\Http\Data\HelperReceiptData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Gives new work to the one helper identity the caller names; the model is named every time.
 *
 * @implements JournalCall<HelperReceiptData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/send', 'POST', HelperReceiptData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SendHelperCall extends Data implements JournalCall
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
        public bool $independent = false,
    ) {}
}
