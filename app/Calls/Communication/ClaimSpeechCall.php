<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Claims your turn to speak on one user message of a chat for two minutes, presenting the batch id and claim grant of
 * the turn that showed you the message; a claim from any other turn is refused.
 *
 * @implements JournalCall<SpeechClaim>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/chat/claim', 'POST', SpeechClaim::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ClaimSpeechCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public readonly string $inboxId,
        #[Size(26)]
        public readonly string $rootId,
        #[Size(26)]
        public readonly string $batchId,
        public readonly string $grant,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
