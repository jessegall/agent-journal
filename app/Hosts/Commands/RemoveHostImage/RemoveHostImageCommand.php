<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostImage;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs a host to remove an image from its Docker daemon, as a dropped driver image no container uses is removed
 * so a host never piles old images up. Answers the instruction's id (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RemoveHostImageCommand extends Command
{
    public function __construct(public string $hostId, public string $image) {}
}
