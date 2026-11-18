<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CreateDocumentHandler
{
    public function __construct(
        private CurrentActor $actors,
        private Dispatcher $events,
    ) {}

    public function handle(CreateDocument $command): CreatedRecord
    {
        $actor = $this->actors->actor();
        $document = Document::publish(MarkdownText::title($command->title), MarkdownText::abstract($command->abstract), MarkdownText::body($command->body), $actor);
        $this->events->dispatch(new DocumentCreated($document->id, $document->number, $actor));

        return new CreatedRecord($document->id, $document->number, 'doc');
    }
}
