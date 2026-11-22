<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\DriverConversationSummary;
use App\Drivers\Enums\HookDriver;

/**
 * The native conversations an agent's starts entered for one driver and context, newest visit first, at most 20.
 */
interface DriverConversationResolver
{
    public const int MOST_CONVERSATIONS = 20;

    /**
     * @return list<DriverConversationSummary>
     */
    public function conversations(string $agentId, HookDriver $driver, string|null $contextReference): array;
}
