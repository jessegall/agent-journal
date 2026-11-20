<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ImportHelperCommitsHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\HelperImportReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Support\RecordIdentity;

/**
 * A parent imports the commits of a helper's certified work into its own repository under the work's ref, to review
 * and merge as ordinary work. Repeating it changes nothing.
 *
 * @extends Command<HelperImportReceipt>
 */
#[HandledBy(ImportHelperCommitsHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('import_helper_commits', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ImportHelperCommits extends Command implements AuthorizedCommand
{
    public function __construct(
        public RecordIdentity $work,
        public string $certificate,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
