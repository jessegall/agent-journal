<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Contracts\Driver as DriverContract;
use App\Agents\Drivers\Contracts\DriverCapabilities;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Exceptions\DriverRequestMismatch;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Sessions\StartReceipt;
use App\Values\BoundTarget;
use App\Values\DriverRegistration;
use App\Values\StartRequest;
use App\Values\SupportSnapshot;

/**
 * A registered driver as the journal reaches it: its registration answers what it is, its capability provider what it
 * can do, and a start or resume goes through the journal's one start command, which records the durable receipt.
 */
final readonly class Driver implements DriverContract
{
    public function __construct(
        private DriverRegistration $registration,
        private DriverCapabilities $capabilities,
        private CommandBus $commands,
        private RuntimeHandling $handling,
    ) {}

    public function descriptor(): DriverRegistration
    {
        return $this->registration;
    }

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return $this->capabilities->capabilities($target);
    }

    /**
     * @throws DriverRequestMismatch
     */
    public function start(StartRequest $request): StartReceipt
    {
        $this->assertFor($request);

        return $this->commands->run(new StartAgentCommand($request));
    }

    /**
     * @throws DriverRequestMismatch
     */
    public function resume(StartRequest $request): StartReceipt
    {
        if ($request->conversationMode !== ConversationModeType::Resume) {
            throw DriverRequestMismatch::notResume((string) $this->registration->key);
        }

        return $this->start($request);
    }

    private function assertFor(StartRequest $request): void
    {
        $requested = $request->selection->driver;

        if ($requested !== $this->registration->family || $request->driverType !== $this->registration->driverType) {
            throw DriverRequestMismatch::for(
                (string) $this->registration->key,
                "{$requested} {$request->driverType->value}",
            );
        }
    }

    public function openStart(AgentRuntime $runtime): void
    {
        $this->handling->openStart($runtime);
    }

    public function continueAgent(AgentRuntime $runtime): void
    {
        $this->handling->continueAgent($runtime);
    }

    public function endWith(HostProcess $process, HostProcessEndEvent $fact): void
    {
        $this->handling->endWith($process, $fact);
    }

    public function isWakeSettledByActivity(): bool
    {
        return $this->handling->isWakeSettledByActivity();
    }

    public function isRuntimeEndedBy(HostProcessEndEvent $fact): bool
    {
        return $this->handling->isRuntimeEndedBy($fact);
    }
}
