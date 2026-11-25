<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\Driver;
use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\Agents\ConversationModeType;
use App\Exceptions\DriverRequestMismatch;
use App\Values\BoundTarget;
use App\Values\DriverRegistration;
use App\Values\StartRequest;
use App\Values\SupportSnapshot;

/**
 * A registered driver as the journal reaches it: its registration answers what it is, its capability provider what it
 * can do, and a start or resume goes through the journal's one start command, which records the durable receipt.
 */
final readonly class RegisteredDriver implements Driver
{
    public function __construct(
        private DriverRegistration $registration,
        private DriverCapabilities $capabilities,
        private CommandBus $commands,
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
}
