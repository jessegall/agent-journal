<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Contracts\SessionProvenance;
use App\Records\Contracts\RecordLinker;
use App\Text\Support\MarkdownText;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\DocumentBody;

final readonly class CreateDocumentHandler extends DocumentCommandHandler
{
    public function __construct(
        private RecordLinker $links,
        private SessionProvenance $provenance,
        private DocumentBody $bodies,
    ) {}

    public function handle(CreateDocument $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $body = $this->bodies->read($command->body, $command->uploadId, UploadType::DocumentBody);
        $document = Document::create($actor);

        $document->startWith(DocumentRevision::create(
            $document,
            trim($command->title),
            trim($command->abstract),
            MarkdownText::body($body)->text,
            $actor->actorType(),
            $actor->actorId(),
        ));

        $this->provenance->record($document);
        $this->provenance->record($document->currentRevisionOrFail());
        $this->links->linkFrom($document, $command->relatedRecords);

        return new CreatedRecord($document->id, $document->number, 'doc');
    }
}
