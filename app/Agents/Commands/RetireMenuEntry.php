<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Handlers\RetireMenuEntryHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * The owner takes an entry out of the menu library: the next uncertain point of any runtime misses it and asks the
 * main agent. The entry is kept, retired.
 *
 * @extends Command<string>
 */
#[HandledBy(RetireMenuEntryHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('menu_retire', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RetireMenuEntry extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $entryId,
        public MenuEntryState $expectedState,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
