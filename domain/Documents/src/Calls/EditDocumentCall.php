<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Domain\Documents\Calls\Concerns\NamesDraft;
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
 * @implements JournalCall<DraftHeld>
 */
#[Endpoint('docs/edit', 'POST', DraftHeld::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditDocumentCall extends Data implements JournalCall
{
    use NamesDraft;

    public function __construct(
        #[Max(32)]
        public string $number,
        #[Max(64)]
        public string $token,
        #[Min(1)]
        public int $version,
        #[In('body', 'section', 'text', 'details')]
        public string $mode,
        public string|null $section,
        public string|null $body,
        public string|null $old,
        public string|null $new,
        public string|null $title,
        public string|null $abstract,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
