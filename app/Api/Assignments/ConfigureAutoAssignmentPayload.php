<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Api\Assignments\Concerns\NamesAssignmentPool;
use App\Api\Assignments\Concerns\NamesAutoAssignment;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Attributes\Api\Endpoint;
use App\Attributes\Validation\SentField;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * @implements ApiPayload<AutoAssignmentChangeData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/auto/configure',
    'POST',
    AutoAssignmentChangeData::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ConfigureAutoAssignmentPayload extends Data implements ApiPayload
{
    use NamesAssignmentPool;
    use NamesAutoAssignment;

    /**
     * @param  list<string>  $records
     */
    public function __construct(
        public readonly string $actorType,
        #[Ulid]
        public readonly string $actorId,
        #[Max(100)]
        public readonly string $assignableType,
        #[Max(100)]
        public readonly string $pool,
        #[SentField, Max(1000)]
        public readonly array $records,
        public readonly int $size,
        #[Min(0)]
        public readonly int $expectedRevision,
        #[Max(64)]
        public readonly string|null $target,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
