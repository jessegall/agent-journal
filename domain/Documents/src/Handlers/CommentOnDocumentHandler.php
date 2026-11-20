<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\CommentOnDocument;
use Domain\Documents\Models\Document;
use Domain\Documents\Resolvers\DocumentRecords;
use Domain\Documents\Support\RecordComments;

final readonly class CommentOnDocumentHandler implements CommandHandler
{
    public function __construct(private RecordComments $comments) {}

    public function handle(CommentOnDocument $command): string
    {
        $id = is_int($command->documentId) ? DocumentRecords::published($command->documentId)->id : $command->documentId;

        return $this->comments->post(
            new RecordIdentity(Document::LINK_TYPE, $id),
            $command->body,
            CommentOnDocument::class,
        );
    }
}
