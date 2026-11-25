<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Api\Assignments\Concerns\NamesAutoAssignment;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Data\Assignments\AutoAssignmentChangeData;
use App\Enums\Processes\ApiEffect;
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
 * Turns off an actor's auto-assignment of one kind of record.
 *
 * @implements ApiPayload<AutoAssignmentChangeData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/auto/disable',
    'POST',
    AutoAssignmentChangeData::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class DisableAutoAssignmentPayload extends Data implements ApiPayload
{
    use NamesAutoAssignment;

    public function __construct(
        public string $actorType,
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
