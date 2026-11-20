<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Assignments\Calls\Concerns\NamesAutoAssignment;
use App\Http\Data\Assignments\AutoAssignmentChangeData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Turns off an actor's auto-assignment of one kind of record.
 *
 * @implements JournalCall<AutoAssignmentChangeData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/auto/disable',
    'POST',
    AutoAssignmentChangeData::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class DisableAutoAssignmentCall extends Data implements JournalCall
{
    use NamesAutoAssignment;

    public function __construct(
        public ActorType $actorType,
        #[Ulid]
        public string $actorId,
        #[Max(100)]
        public string $assignableType,
        #[Min(0)]
        public int $expectedRevision,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
