<?php

declare(strict_types=1);

namespace App\Numbers\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Numbers\Handlers\InstallNumbersHandler;

/**
 * Creates the journal's global number group, once; running it again changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(InstallNumbersHandler::class)]
final readonly class InstallNumbers extends Command {}
