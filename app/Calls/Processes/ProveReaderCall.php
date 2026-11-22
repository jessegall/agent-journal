<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Replays a draft reader over sample runs to prove it.
 *
 * @implements JournalCall<ReaderProofStarted>
 */
#[Endpoint(
    'processes/requests/{commandRequest}/proofs',
    'POST',
    ReaderProofStarted::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ProveReaderCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $runs
     */
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        #[MapName('reader_revision'), Max(64)]
        public string $readerRevision,
        #[Min(1), Max(20)]
        public array $runs,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
