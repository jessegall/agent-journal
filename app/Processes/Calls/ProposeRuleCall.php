<?php

declare(strict_types=1);

namespace App\Processes\Calls;

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
 * Proposes a classification rule for a held command; the request key makes a retry the same proposal.
 *
 * @implements JournalCall<ProposalReceived>
 */
#[Endpoint(
    'processes/requests/{commandRequest}/proposals',
    'POST',
    ProposalReceived::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ProposeRuleCall extends Data implements JournalCall
{
    /**
     * @param  array<string, mixed>  $declaration
     */
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        public array $declaration,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
