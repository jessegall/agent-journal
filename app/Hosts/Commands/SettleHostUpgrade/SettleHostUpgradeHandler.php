<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SettleHostUpgrade;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderStatus;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;

/**
 * Fails the host's upgrade when the host refused its order, with the reason the host gave.
 */
final readonly class SettleHostUpgradeHandler implements CommandHandler
{
    public function handle(SettleHostUpgradeCommand $command): void
    {
        $order = HostOrder::findLocked($command->orderId);

        if ($order->status !== HostOrderStatus::Refused) {
            return;
        }

        $reason = $order->answer->reason ?? $order->refusal?->value;
        Host::findLocked($order->host_id)->failUpgrade("The host refused the upgrade: {$reason}.");
    }
}
