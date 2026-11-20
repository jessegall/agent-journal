<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Domain\Plans\Commands\AddPhaseTasks;
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
 * Adds tasks to the end of a phase, as the revision its caller read.
 *
 * @implements JournalCall<PhaseTasksAdded>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/add-tasks', 'POST', PhaseTasksAdded::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AddPhaseTasksCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(
        #[Ulid]
        public string $phaseId,
        #[Min(1)]
        public int $expectedRevision,
        #[Min(1)]
        #[Max(AddPhaseTasks::MAX_TASKS)]
        public array $taskIds,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
