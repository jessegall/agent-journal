<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\RecoverDraftHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/** @extends Command<DraftReference> */
#[HandledBy(RecoverDraftHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('recover_draft', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class RecoverDraft extends Command implements AuthorizedCommand
{
    public function __construct(public string $draftId, public int $expectedRevision) {}

    public function subject(): string
    {
        return Document::class;
    }
}
