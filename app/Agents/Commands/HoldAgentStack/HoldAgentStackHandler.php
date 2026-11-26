<?php

declare(strict_types=1);

namespace App\Agents\Commands\HoldAgentStack;

use App\Agents\Exceptions\StackMissing;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentStackRow;
use Carbon\CarbonImmutable;

final readonly class HoldAgentStackHandler implements CommandHandler
{
    /**
     * @throws StackMissing
     */
    public function handle(HoldAgentStackCommand $command): void
    {
        $stacks = AgentStackRow::query()->acrossEveryAgent()->forTarget($command->target);

        AgentStackRow::findLockedKeptFor($stacks, $command->target)->holdForInvestigation(CarbonImmutable::now());
    }
}
