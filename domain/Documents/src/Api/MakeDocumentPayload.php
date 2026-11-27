<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use Spatie\LaravelData\Attributes\Validation\Present;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * @implements ApiPayload<RecordFiled>
 */
#[Endpoint('docs/make', 'POST', RecordFiled::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class MakeDocumentPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $relatedRecords
     */
    public function __construct(
        public readonly string $title,
        public readonly string $abstract,
        #[Present]
        #[MapName('about')]
        public readonly array $relatedRecords,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        public readonly string|null $body = null,
        #[MapName('upload_id')]
        public readonly string|null $uploadId = null,
    ) {}
}
