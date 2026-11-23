<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Activity\ActivityLog;
use App\Contracts\Events\Listener;
use App\Events\ToolCallFinished;
use App\Values\ToolActivity;

/**
 * Records a file an agent read or edited, or a command it ran, once the tool call finished; a call a hook refused
 * never finishes, so it leaves no entry.
 */
final readonly class ToolActivityRecorder implements Listener
{
    public function __construct(private ActivityLog $activity) {}

    public function handle(ToolCallFinished $fact): void
    {
        $activity = ToolActivity::of($fact->finishedTool);

        if ($activity->isEmpty()) {
            return;
        }

        $this->activity->record($fact->target->actorIdentity(), $activity->get()->type, $activity->get()->subject);
    }
}
