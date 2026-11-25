<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Opens a draft of a document for the caller to edit.
 *
 * @implements ApiPayload<DraftHeld>
 */
#[Endpoint('docs/open', 'POST', DraftHeld::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class OpenDocumentPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[MapName('expected_revision')]
        public int|null $expectedRevision = null,
    ) {}
}
