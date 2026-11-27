<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SignalHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;

/**
 * Makes the signal order of a running process, refused to a replaced worker.
 */
final readonly class SignalHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(SignalHostProcessCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Signal,
            ['signal' => $command->signal],
        )->getKey();
    }
}
