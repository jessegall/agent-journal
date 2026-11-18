<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\AddPhaseTasksHandler;

/**
 * Puts tasks, named by id, at the end of a phase in the order given.
 *
 * @implements Command<null>
 */
#[HandledBy(AddPhaseTasksHandler::class)]
final readonly class AddPhaseTasks implements Command
{
    /**
     * @param  list<int>  $taskIds
     */
    public function __construct(
        public int $phaseId,
        public array $taskIds,
    ) {}
}
