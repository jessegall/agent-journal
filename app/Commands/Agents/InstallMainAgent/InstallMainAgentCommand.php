<?php

declare(strict_types=1);

namespace App\Commands\Agents\InstallMainAgent;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Creates the installation's main agent and designates it once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallMainAgentCommand extends Command {}
