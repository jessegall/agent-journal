<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\AddPhaseTasksHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;

/**
 * Puts tasks, named by id, at the end of a phase in the order given.
 *
 * @extends Command<null>
 */
#[HandledBy(AddPhaseTasksHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
#[Operation('add_phase_tasks', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class AddPhaseTasks extends Command implements AuthorizedCommand
{
    public const int MAX_TASKS = 100;

    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(
        public string $phaseId,
        public int $expectedRevision,
        #[Min(1)]
        #[Max(self::MAX_TASKS)]
        public array $taskIds,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
