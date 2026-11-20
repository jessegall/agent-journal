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
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Marks a message as one that must be answered.
 *
 * @implements JournalCall<MessageNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'communication/require-answer',
    'POST',
    MessageNamed::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class RequireMessageAnswerCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
