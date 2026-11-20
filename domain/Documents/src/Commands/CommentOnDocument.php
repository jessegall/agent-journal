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
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Handlers\CommentOnDocumentHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * @extends Command<string>
 */
#[HandledBy(CommentOnDocumentHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('comment_on_document', ResourceAreaType::JournalContent, AccessType::Create)]
final readonly class CommentOnDocument extends Command implements AuthorizedCommand
{
    public function __construct(public string $documentId, public string $body) {}

    public function subject(): string
    {
        return Document::class;
    }
}
