<?php

declare(strict_types=1);

namespace App\Commands\ReportProjectRead;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Enums\ProjectReadFailure;
use App\Support\Command;
use App\Values\ProjectEntry;
use App\Values\ProjectFileText;

/**
 * A host answers a read of its project once: a folder's entries, a file's text with the digest and size of the whole
 * file, or why it could not read it. A late answer for a read that expired changes nothing; a file read whole is
 * kept as a version of that file, once per digest, for comments on its lines.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportProjectReadCommand extends Command
{
    /**
     * @param  list<ProjectEntry>  $entries
     */
    public function __construct(
        public string $hostId,
        public string $readId,
        public array $entries,
        public ProjectFileText|null $text,
        public bool $isTruncated,
        public ProjectReadFailure|null $failure,
    ) {}
}
