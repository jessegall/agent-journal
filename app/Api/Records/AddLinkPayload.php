<?php

declare(strict_types=1);

namespace App\Api\Records;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Links two records, such as doc 12 and task 7.
 *
 * @implements ApiPayload<LinkChanged>
 */
#[Endpoint('links/add', 'POST', LinkChanged::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AddLinkPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public string $source,
        #[Max(64)]
        public string $target,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
