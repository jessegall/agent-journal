<?php

declare(strict_types=1);

namespace App\Agents\Commands\InstallMainAgent;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Creates the installation's main agent in its local project and designates it once; running it again changes
 * nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallMainAgentCommand extends Command
{
    public function __construct(public string $projectId) {}
}
