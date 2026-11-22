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
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Revises a rule proposal against the revision its author read.
 *
 * @implements JournalCall<ProposalReceived>
 */
#[Endpoint(
    'processes/proposals/{proposal}/revisions',
    'POST',
    ProposalReceived::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ReviseProposalCall extends Data implements JournalCall
{
    /**
     * @param  array<string, mixed>  $declaration
     */
    public function __construct(
        #[InPath, FromRouteParameter('proposal')]
        public string $proposal,
        public array $declaration,
        #[MapName('expected_revision'), Min(1)]
        public int|null $expectedRevision,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
