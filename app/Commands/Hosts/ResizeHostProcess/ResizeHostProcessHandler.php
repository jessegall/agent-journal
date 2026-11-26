<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ResizeHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

/**
 * Makes the resize order of a running process, refused to a replaced worker.
 */
final readonly class ResizeHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(ResizeHostProcessCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Resize,
            [
                'columns' => $command->columns,
                'rows' => $command->rows,
            ],
        )->id;
    }
}
