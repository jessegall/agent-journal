<?php

declare(strict_types=1);

namespace App\Engine\Commands;

use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Engine\Handlers\SettleFrameTimesHandler;
use App\Engine\Values\FrameSettlement;

/**
 * Moves the timing checkpoints of a batch of settled frames, after their effects committed.
 *
 * @implements Command<null>
 */
#[HandledBy(SettleFrameTimesHandler::class)]
#[AllowsEngine]
final readonly class SettleFrameTimes implements Command
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
