<?php

declare(strict_types=1);

namespace App\Calls\Records;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Removes the link between two records; both records stay.
 *
 * @implements JournalCall<LinkChanged>
 */
#[Endpoint('links/remove', 'POST', LinkChanged::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RemoveLinkCall extends Data implements JournalCall
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
