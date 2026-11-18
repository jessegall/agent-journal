<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\MarkSilentSessionsHandler;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Marks silent every session whose beats stopped for a presence window; the engine runs it on each pass.
 *
 * @implements Command<null>
 */
#[HandledBy(MarkSilentSessionsHandler::class)]
#[AllowsEngine]
final readonly class MarkSilentSessions implements Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'agents.silence';
}
