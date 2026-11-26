<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ForwardUserKeys;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;
use App\Models\Hosts\HostProcess;

/**
 * Makes the user's key write of a running terminal process and raises its input generation, so the journal's next
 * guarded write carries the generation the host now holds.
 */
final readonly class ForwardUserKeysHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(ForwardUserKeysCommand $command): string
    {
        $order = $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::WriteKeys,
            ['bytes' => base64_encode($command->bytes), 'as_user' => true],
            HostOrderPlacement::KEY_SECONDS,
        );

        HostProcess::findLocked($command->processId)->raiseInputGeneration();

        return $order->getKey();
    }
}
