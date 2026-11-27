<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ForwardUserKeys;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\Data\HostKeyWriteData;
use App\Hosts\Protocol\HostOrders;
use App\Models\Hosts\HostProcess;

/**
 * Makes the user's key write of a running terminal process and raises its input generation, so the journal's next
 * guarded write carries the generation the host now holds.
 */
final readonly class ForwardUserKeysHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(ForwardUserKeysCommand $command): string
    {
        $order = $this->orders->writeKeys(
            $command->processId,
            $command->source,
            HostKeyWriteData::from([
                'bytes' => base64_encode($command->bytes),
                'if_rows' => null,
                'if_input_generation' => null,
                'as_user' => true,
            ]),
            HostOrderPlacement::KEY_SECONDS,
        );

        HostProcess::findLocked($command->processId)->raiseInputGeneration();

        return $order->getKey();
    }
}
