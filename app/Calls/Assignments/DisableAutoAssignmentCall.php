<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesAutoAssignment;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AutoAssignmentChangeData;
use App\Enums\ActorType;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
