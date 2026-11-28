<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\AcknowledgeWake;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Time\Contracts\ServerClock;

/**
 * Marks each staged or applying wake of the session's runtime as answered by activity now; a session without a runtime
 * has none.
 */
final readonly class AcknowledgeWakeHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private DriverCatalogue $drivers) {}

    public function handle(AcknowledgeWakeCommand $command): void
    {
        $runtime = AgentRuntime::findForSession($command->sessionId);

        // A turn's wake settles when its turn ends, so its hooks' activity leaves it open, as its driver says.
        if ($runtime === null || ! $this->drivers->forRuntime($runtime)->isWakeSettledByActivity()) {
            return;
        }

        DriverRequest::query()
            ->ofAgentRuntime($runtime->id)
            ->withOperation(DriverOperation::Wake)
            ->withAnyProgress([RequestProgress::Staged, RequestProgress::Applying])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $wake) => $wake->acknowledgeActivityAt($this->clock->now()));
    }
}
