<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Confirms the pieces of a presentation batch your driver showed, by the handles the batch gave them.
 *
 * @implements JournalCall<PresentationAcknowledged>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'communication/chat/acknowledge',
    'POST',
    PresentationAcknowledged::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class AcknowledgePresentationCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $handles
     */
    public function __construct(
        #[Size(26)]
        public readonly string $batchId,
        public readonly array $handles,
        #[Max(255)]
        public readonly string $contextKey,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
