<?php

declare(strict_types=1);

namespace App\Commands\Agents\SettleFrameTimes;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\FrameSettlement;

/**
 * Moves the timing checkpoints of a batch of settled frames, after their effects committed.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class SettleFrameTimesCommand extends Command
{
    /**
     * The maintenance capability under which the engine settles the times of many frames at once.
     */
    public const string MAINTENANCE_SCOPE = 'engine.timing';

    /**
     * @param  list<FrameSettlement>  $settlements
     */
    public function __construct(public array $settlements) {}
}
