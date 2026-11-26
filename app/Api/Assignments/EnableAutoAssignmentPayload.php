<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Api\Assignments\Concerns\NamesAssignmentPool;
use App\Api\Assignments\Concerns\NamesAutoAssignment;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Attributes\Api\Endpoint;
use App\Attributes\Api\PresentList;
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
 * Turns on an actor's auto-assignment of one kind of record from a pool.
 *
 * @implements ApiPayload<AutoAssignmentChangeData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/auto/enable',
    'POST',
    AutoAssignmentChangeData::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class EnableAutoAssignmentPayload extends Data implements ApiPayload
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
