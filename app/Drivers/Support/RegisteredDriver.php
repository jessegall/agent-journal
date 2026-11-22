<?php

declare(strict_types=1);

namespace App\Drivers\Support;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Contracts\Driver;
use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Exceptions\DriverRequestMismatch;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\DriverRegistration;
use App\Drivers\Values\SupportSnapshot;

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

        if ($requested !== $this->registration->family || $request->variant !== $this->registration->mode) {
            throw DriverRequestMismatch::for((string) $this->registration->key, "{$requested} {$request->variant->value}");
        }
    }
}
