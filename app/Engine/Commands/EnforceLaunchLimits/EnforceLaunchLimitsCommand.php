<?php

declare(strict_types=1);

namespace App\Engine\Commands\EnforceLaunchLimits;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Stops every launch past its wall limit and every session of a revoked profile revision; the engine runs it on each
 * pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class EnforceLaunchLimitsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.launch-limits';
}
