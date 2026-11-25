<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\AdmissionRefused;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Asks the journal to admit one shell line through the one shell admission; the admission keeps its own repeat
 * check on the request key, so a lost answer asked again under the same key admits the line once.
 *
 * @implements JournalCall<LineAdmitted>
 */
#[Endpoint(
    'processes/admit',
    'POST',
    LineAdmitted::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::Operation,
    refusals: [AdmissionRefused::class],
)]
final class AdmitLineCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(100_000)]
        public string $line,
        public ShellDialect $dialect,
        #[MapName('working_folder'), Max(4096)]
        public string $workingFolder,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
