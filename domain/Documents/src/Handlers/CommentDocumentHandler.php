<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use Domain\Documents\Api\Events\RecordCommented;
use Domain\Documents\Commands\CommentDocument;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CommentDocumentHandler
{
    public function __construct(private CurrentActor $actors, private Dispatcher $events) {}

    public function handle(CommentDocument $command): void
    {
        $document = Document::query()->sharedPublished()->where('number', $command->documentNumber)->first() ?? throw DocumentMissing::numbered($command->documentNumber);
        $body = MarkdownText::comment($command->body);

        if ($command->anchor !== null) {
            $revision = $document->revisions()->where('number', $command->anchor->revisionNumber)->first() ?? throw DocumentMissing::numbered($command->documentNumber);
            $command->anchor->requireQuoteIn($revision->body);
        }

        $comment = RecordComment::post(Document::LINK_TYPE, $document->id, $this->actors->actor(), $body, $command->anchor);
        $this->events->dispatch(new RecordCommented($comment->id, Document::LINK_TYPE, $document->id));
    }
}
