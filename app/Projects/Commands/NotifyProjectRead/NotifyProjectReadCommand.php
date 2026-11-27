<?php

declare(strict_types=1);

namespace App\Projects\Commands\NotifyProjectRead;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Protocol\Data\HostProjectEntryData;
use App\Hosts\Protocol\HostProjectReadFailure;
use App\Projects\Values\ProjectFileText;
use App\Support\Command;

/**
 * A host answers a read of its project once: a folder's entries, a file's text with its digest and size, or why it
 * could not read it. A late answer changes nothing; a file read whole is kept once per digest for comments on its
 * lines. Run by the journal for an authenticated host.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyProjectReadCommand extends Command
{
    /**
     * @param  list<HostProjectEntryData>  $entries
     */
    public function __construct(
        public string $hostId,
        public string $readId,
        public array $entries,
        public ProjectFileText|null $text,
        public bool $isTruncated,
        public HostProjectReadFailure|null $failure,
    ) {}
}
