<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\PresentList;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Assignments\Calls\Concerns\NamesAssignmentPool;
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
 * Changes the pool or size of an actor's auto-assignment.
 *
 * @implements JournalCall<AutoAssignmentChangeData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/auto/configure',
    'POST',
    AutoAssignmentChangeData::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ConfigureAutoAssignmentCall extends Data implements JournalCall
{
    use NamesAssignmentPool;
    use NamesAutoAssignment;

    /**
     * @param  list<string>  $records
     */
    public function __construct(
        public ActorType $actorType,
        #[Ulid]
        public string $actorId,
        #[Max(100)]
        public string $assignableType,
        #[Max(100)]
        public string $pool,
        #[PresentList, Max(1000)]
        public array $records,
        public int $size,
        #[Min(0)]
        public int $expectedRevision,
        #[Max(64)]
        public string|null $target,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
