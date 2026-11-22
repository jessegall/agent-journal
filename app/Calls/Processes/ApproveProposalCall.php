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
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Approves a rule proposal as the revisions the owner reviewed, with a proven reader when it has one.
 *
 * @implements JournalCall<RuleApproved>
 */
#[Endpoint(
    'processes/proposals/{proposal}/approve',
    'POST',
    RuleApproved::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ApproveProposalCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('proposal')]
        public string $proposal,
        #[MapName('expected_revision'), Min(0)]
        public int $expectedRevision,
        #[MapName('expected_active_revision'), Min(0)]
        public int $expectedActiveRevision,
        #[MapName('reader_revision'), Max(64), RequiredWith('proof')]
        public string|null $readerRevision,
        #[Max(64), RequiredWith('reader_revision')]
        public string|null $proof,
        #[Max(2000)]
        public string $reason,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
