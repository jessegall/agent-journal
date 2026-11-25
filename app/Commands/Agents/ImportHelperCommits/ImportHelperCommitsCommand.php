<?php

declare(strict_types=1);

namespace App\Commands\Agents\ImportHelperCommits;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;
use App\Values\HelperImportReceipt;

/**
 * A parent imports the commits of a helper's certified work into its own repository under the work's ref, to review
 * and merge as ordinary work. Repeating it changes nothing.
 *
 * @extends Command<HelperImportReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ImportHelperCommitsCommand extends Command
{
    public function __construct(
        public RecordIdentity $work,
        public string $certificate,
    ) {}
}
