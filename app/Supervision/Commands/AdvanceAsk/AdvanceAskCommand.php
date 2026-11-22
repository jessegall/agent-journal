<?php

declare(strict_types=1);

namespace App\Supervision\Commands\AdvanceAsk;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Moves one due ask a hop up its supervisor chain, or closes it unanswered; the engine runs it for each due ask, each
 * in its own transaction, so one that fails holds back no other.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class AdvanceAskCommand extends Command
{
    /**
     * The maintenance capability the engine grants for advancing asks.
     */
    public const string MAINTENANCE_SCOPE = 'supervision.advance';

    public function __construct(public string $askId) {}
}
