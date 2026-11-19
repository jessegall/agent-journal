<?php

declare(strict_types=1);

namespace App\Engine\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Engine\Handlers\SettleFrameTimesHandler;
use App\Engine\Values\FrameSettlement;

/**
 * Moves the timing checkpoints of a batch of settled frames, after their effects committed.
 *
 * @extends Command<null>
 */
#[HandledBy(SettleFrameTimesHandler::class)]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class SettleFrameTimes extends Command
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
