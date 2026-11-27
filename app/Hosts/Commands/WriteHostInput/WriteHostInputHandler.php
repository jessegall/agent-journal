<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostStdinWriteData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the stdin write of a running pipe process, refused to a replaced worker and to a terminal process.
 */
final readonly class WriteHostInputHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(WriteHostInputCommand $command): string
    {
        return $this->orders->writeStdin(
            $command->processId,
            $command->source,
            HostStdinWriteData::from(['bytes' => base64_encode($command->bytes)]),
        )->getKey();
    }
}
