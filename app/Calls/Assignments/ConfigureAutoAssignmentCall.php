<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Endpoint;
use App\Attributes\PresentList;
use App\Calls\Assignments\Concerns\NamesAssignmentPool;
use App\Calls\Assignments\Concerns\NamesAutoAssignment;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AutoAssignmentChangeData;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
        public string $actorType,
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
