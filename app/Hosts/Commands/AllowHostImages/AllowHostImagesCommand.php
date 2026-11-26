<?php

declare(strict_types=1);

namespace App\Hosts\Commands\AllowHostImages;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Orders a contained host to let its containers run only these pinned images. Run by the journal itself after the
 * host's inventory and whenever the agent image changed (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class AllowHostImagesCommand extends Command
{
    /**
     * @param  list<string>  $images
     */
    public function __construct(public string $hostId, public array $images) {}
}
