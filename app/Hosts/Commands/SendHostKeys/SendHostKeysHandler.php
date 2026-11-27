<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SendHostKeys;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\Data\HostKeyWriteData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the guarded key write of a running process, refused to a replaced worker.
 */
final readonly class SendHostKeysHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(SendHostKeysCommand $command): string
    {
        return $this->orders->writeKeys(
            $command->processId,
            $command->source,
            HostKeyWriteData::from([
                'bytes' => base64_encode($command->bytes),
                'if_rows' => $command->rows->guard(),
                'if_input_generation' => $command->inputGeneration,
                'as_user' => false,
            ]),
            HostOrderPlacement::KEY_SECONDS,
        )->getKey();
    }
}
