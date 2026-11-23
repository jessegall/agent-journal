<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Chat\ChatLines;
use App\Contracts\Events\Listener;
use App\Events\ProcessRunOutlasted;
use App\Models\Runs\ProcessRun;
use App\Support\Cards\DockIdentity;

/**
 * Shows a run that outlasted a quick command in its agent's chats, as a card that follows the run to its end.
 */
#[InCommandTransaction]
final readonly class ShowLongRunInChat implements Listener
{
    public function __construct(private ChatLines $lines) {}

    public function handle(ProcessRunOutlasted $fact): void
    {
        $this->lines->post(
            $fact->runner,
            'A command',
            'runs',
            new DockIdentity(ProcessRun::DOCK_TYPE, $fact->processRunId),
        );
    }
}
