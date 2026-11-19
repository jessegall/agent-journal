<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * A keyed write declared in full: its path placeholder, its answer, its receipt owner and its request key.
 *
 * @implements JournalCall<NoteAnswer>
 */
#[Endpoint('notes/{notebookId}/write', 'POST', NoteAnswer::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class WriteNoteCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('notebookId')]
        public string $notebookId,
        public string $text,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
