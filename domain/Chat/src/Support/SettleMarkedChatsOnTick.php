<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use Domain\Chat\Commands\SettleMarkedChats\SettleMarkedChatsCommand;

/**
 * Settles marked chats nobody opens on every engine pass; each pass takes one bounded batch, so it needs no throttle.
 * It reads nothing of the tick, so it takes any object rather than naming Core's event outside a listener.
 */
final readonly class SettleMarkedChatsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return SettleMarkedChatsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(object $event): void
    {
        $this->commands->run(new SettleMarkedChatsCommand());
    }
}
