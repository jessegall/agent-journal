<?php

declare(strict_types=1);

namespace App\Profiles\Commands\InstallMainAgent;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Creates the installation's main agent and designates it once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstallMainAgentCommand extends Command {}
