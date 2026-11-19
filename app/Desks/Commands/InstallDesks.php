<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Desks\Handlers\InstallDesksHandler;

/**
 * Creates Core's built-in desks once; running it again changes nothing.
 *
 * @implements Command<null>
 */
#[HandledBy(InstallDesksHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class InstallDesks implements Command {}
