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
use Domain\Documents\Api\Concerns\NamesDraft;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Closes the caller's draft, publishing it as a revision when it changed.
 *
 * @implements ApiPayload<DraftClosed>
 */
#[Endpoint('docs/close', 'POST', DraftClosed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CloseDocumentPayload extends Data implements ApiPayload
{
    use NamesDraft;

    public function __construct(
        #[Max(32)]
        public string $number,
        #[Max(64)]
        public string $token,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[Min(1)]
        public int|null $version = null,
    ) {}
}
