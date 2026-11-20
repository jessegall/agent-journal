<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Contracts\SessionProvenance;
use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordLinker;
use App\Text\Support\MarkdownText;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\DocumentBody;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CreateDocumentHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private RecordLinker $links,
        private SessionProvenance $provenance,
        private DocumentBody $bodies,
    ) {}

    public function handle(CreateDocument $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $body = $this->bodies->read($command->body, $command->uploadId, UploadType::DocumentBody);
        $document = Document::publish($command->title, $command->abstract, MarkdownText::body($body), $actor);
        $this->provenance->record($document);
        $this->provenance->record($document->currentRevisionOrFail());
        $this->links->linkFrom($document, $command->relatedRecords);
        $this->events->dispatch(new DocumentCreated($document->id, $document->number, $actor));

        return new CreatedRecord($document->id, $document->number, 'doc');
    }
}
