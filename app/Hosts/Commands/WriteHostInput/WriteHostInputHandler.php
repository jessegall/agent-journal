<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;

/**
 * Makes the stdin write of a running pipe process, refused to a replaced worker and to a terminal process.
 */
final readonly class WriteHostInputHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(WriteHostInputCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::WriteStdin,
            ['bytes' => base64_encode($command->bytes)],
        )->getKey();
    }
}
