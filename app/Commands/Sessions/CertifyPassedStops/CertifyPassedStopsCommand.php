<?php

declare(strict_types=1);

namespace App\Commands\Sessions\CertifyPassedStops;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Certifies the work of stops whose final checks passed after their stop was answered, so work is certified once even
 * when the agent never stops again; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class CertifyPassedStopsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'hooks.certify';
}
