<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
 * @implements JournalCall<DraftHeld>
 */
#[Endpoint('docs/open', 'POST', DraftHeld::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class OpenDocumentCall extends Data implements JournalCall
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
