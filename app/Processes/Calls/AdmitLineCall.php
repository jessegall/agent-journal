<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\AdmissionRefused;
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
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
