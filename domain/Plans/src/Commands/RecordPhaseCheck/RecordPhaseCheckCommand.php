<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RecordPhaseCheck;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Plans\Policies\PlanPolicy;

/**
 * An agent or a user records the validated result of a check on a phase; only a current receipt newer than the
 * phase's last task change is accepted.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class RecordPhaseCheckCommand extends Command
{
    public function __construct(public string $phaseId, public string $receiptId) {}
}
