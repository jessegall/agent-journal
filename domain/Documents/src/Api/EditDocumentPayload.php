<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Documents\Api\Concerns\NamesDraft;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Changes the caller's draft: its body, one section, one exact piece of text, or its details.
 *
 * @implements ApiPayload<DraftHeld>
 */
#[Endpoint('docs/edit', 'POST', DraftHeld::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditDocumentPayload extends Data implements ApiPayload
{
    use NamesDraft;

    public function __construct(
        #[Max(32)]
        public readonly string $number,
        #[Max(64)]
        public readonly string $token,
        #[Min(1)]
        public readonly int $version,
        #[In('body', 'section', 'text', 'details')]
        public readonly string $mode,
        public readonly string|null $section,
        public readonly string|null $body,
        #[MapName('old')]
        public readonly string|null $originalText,
        #[MapName('new')]
        public readonly string|null $replacementText,
        public readonly string|null $title,
        public readonly string|null $abstract,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[MapName('upload_id')]
        public readonly string|null $uploadId = null,
    ) {}
}
