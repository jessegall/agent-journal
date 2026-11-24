<?php

declare(strict_types=1);

namespace App\Commands\HoldAgentStack;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\StackMissing;
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

        AgentStackRow::lockKeptFor($stacks, $command->target)->holdForInvestigation(CarbonImmutable::now());
    }
}
