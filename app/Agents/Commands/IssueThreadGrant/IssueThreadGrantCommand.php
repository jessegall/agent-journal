<?php

declare(strict_types=1);

namespace App\Agents\Commands\IssueThreadGrant;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Sessions\AgentClientSettings;
use App\Support\Command;

/**
 * Issues the grant a runtime's thread on its account's app server signs in to the journal with: the start's own grant
 * for the first thread, a fresh token for each later one (internal, not exported).
 *
 * @extends Command<AgentClientSettings>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class IssueThreadGrantCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
