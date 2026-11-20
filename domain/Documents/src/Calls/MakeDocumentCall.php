<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\PresentList;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Files a new document about the records named.
 *
 * @implements JournalCall<RecordFiled>
 */
#[Endpoint('docs/make', 'POST', RecordFiled::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class MakeDocumentCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $about
     */
    public function __construct(
        public string $title,
        public string $abstract,
        public string $body,
        #[PresentList]
        public array $about,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
