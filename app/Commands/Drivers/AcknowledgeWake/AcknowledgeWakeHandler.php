<?php

declare(strict_types=1);

namespace App\Commands\Drivers\AcknowledgeWake;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;

/**
 * Marks each staged or applying wake of the session's runtime as answered by activity now; a session without a runtime
 * has none.
 */
final readonly class AcknowledgeWakeHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(AcknowledgeWakeCommand $command): void
    {
        $runtime = AgentRuntime::findForSession($command->sessionId);

        if ($runtime === null) {
            return;
        }

        DriverRequest::query()
            ->ofAgentRuntime($runtime->id)
            ->withOperation(DriverOperation::Wake)
            ->withAnyProgress([
                RequestProgress::Staged,
                RequestProgress::Applying,
            ])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $wake) => $wake->acknowledgeActivityAt($this->clock->now()));
    }
}
