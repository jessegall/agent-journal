<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\PresentList;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Files a new report about the records named.
 *
 * @implements ApiPayload<RecordFiled>
 */
#[Endpoint('reports/make', 'POST', RecordFiled::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class MakeReportPayload extends Data implements ApiPayload
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
