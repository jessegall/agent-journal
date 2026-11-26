<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SignalHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

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
