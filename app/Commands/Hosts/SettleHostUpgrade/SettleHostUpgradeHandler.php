<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SettleHostUpgrade;

use App\Contracts\Bus\CommandHandler;
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

        if (! $order->answer?->isRefused()) {
            return;
        }

        $reason = $order->answer->facts['reason'] ?? $order->answer->refusalReason()->value;
        Host::findLocked($order->host_id)->failUpgrade("The host refused the upgrade: {$reason}.");
    }
}
