<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * A keyed write declared in full: its path placeholder, its answer, its receipt owner and its request key.
 *
 * @implements ApiPayload<NoteAnswer>
 */
#[Endpoint('notes/{notebookId}/write', 'POST', NoteAnswer::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class WriteNotePayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameter('notebookId')]
        public string $notebookId,
        public string $text,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
