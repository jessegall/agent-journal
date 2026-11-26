<?php

declare(strict_types=1);

namespace App\Agents\Commands\SettleFrameTimes;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Values\FrameSettlement;
use App\Attributes\Commands\Entry;
use App\Support\Command;

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
