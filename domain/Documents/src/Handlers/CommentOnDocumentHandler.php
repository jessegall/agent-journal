<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Comments\Commands\PostComment;
use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\CommentOnDocument;
use Domain\Documents\Models\Document;

final readonly class CommentOnDocumentHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands, private RequestKey $key) {}

    public function handle(CommentOnDocument $command): string
    {
        return $this->commands->run(new PostComment(
            new RecordIdentity(Document::LINK_TYPE, $command->documentId),
            $command->body,
            $this->key->requireFor(CommentOnDocument::class),
        ));
    }
}
