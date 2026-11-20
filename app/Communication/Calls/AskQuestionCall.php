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
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/** @implements JournalCall<MessageNamed> */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/question', 'POST', MessageNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AskQuestionCall extends Data implements JournalCall
{
    public function __construct(
        #[Required]
        public readonly string $body,
        #[MapName('request_key')]
        #[WithCast(CallKeyCast::class)]
        #[LiteralTypeScriptType('string')]
        #[WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        public readonly QuestionRecord|null $relatedRecord = null,
    ) {}
}
