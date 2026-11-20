<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Supervision\Handlers\AdvanceAskHandler;

/**
 * Moves one due ask a hop up its supervisor chain, or closes it unanswered; the engine runs it for each due ask, each
 * in its own transaction, so one that fails holds back no other.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[HandledBy(AdvanceAskHandler::class)]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class AdvanceAsk extends Command
{
    /**
     * The maintenance capability the engine grants for advancing asks.
     */
    public const string MAINTENANCE_SCOPE = 'supervision.advance';

    public function __construct(public string $askId) {}
}
