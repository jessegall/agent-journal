<?php

declare(strict_types=1);

namespace App\Hosts\Commands\BuildHostDriverImage;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Sends a host the signed build of one of its pending driver images, from the recipe's kept inputs. Run by the
 * journal itself after it reserved the host's images (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class BuildHostDriverImageCommand extends Command
{
    public function __construct(public string $hostId, public string $hostDriverImageId) {}
}
