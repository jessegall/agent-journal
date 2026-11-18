<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\RecordPhaseCheckHandler;

/**
 * An agent or a user records the validated result of a check on a phase; only a current receipt newer than the
 * phase's last task change is accepted.
 *
 * @implements Command<string>
 */
#[HandledBy(RecordPhaseCheckHandler::class)]
final readonly class RecordPhaseCheck implements Command
{
    public function __construct(public string $phaseId, public string $receiptId) {}
}
