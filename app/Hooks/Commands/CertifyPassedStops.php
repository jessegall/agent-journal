<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Hooks\Handlers\CertifyPassedStopsHandler;

/**
 * Certifies the work of stops whose final checks passed after their stop was answered, so work is certified once even
 * when the agent never stops again; the engine runs it on each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
#[HandledBy(CertifyPassedStopsHandler::class)]
final readonly class CertifyPassedStops extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'hooks.certify';
}
