<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ResizeHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostTerminalSizePayload;

/**
 * Makes the resize instruction of a running process, refused to a replaced worker.
 */
final readonly class ResizeHostProcessHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(ResizeHostProcessCommand $command): string
    {
        return $this->instructions->resize(
            $command->processId,
            $command->source,
            HostTerminalSizePayload::from(['columns' => $command->columns, 'rows' => $command->rows]),
        )->getKey();
    }
}
