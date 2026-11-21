<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\InstallMainAgentHandler;

/**
 * Creates the installation's main agent and designates it once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(InstallMainAgentHandler::class)]
final readonly class InstallMainAgent extends Command {}
