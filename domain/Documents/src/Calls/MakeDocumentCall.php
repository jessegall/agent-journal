<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Attributes\PresentList;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
     * @param  list<string>  $relatedRecords
     */
    public function __construct(
        public string $title,
        public string $abstract,
        #[PresentList]
        #[MapName('about')]
        public array $relatedRecords,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        public string|null $body = null,
        #[MapName('upload_id')]
        public string|null $uploadId = null,
    ) {}
}
