<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
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
        #[Max(AddPhaseTasksCommand::MAX_TASKS)]
        public array $taskIds,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
