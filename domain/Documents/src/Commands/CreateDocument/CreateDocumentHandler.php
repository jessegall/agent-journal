<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CreateDocument;

use App\Contracts\Records\RecordLinker;
use App\Contracts\Sessions\SessionProvenance;
use App\Support\MarkdownText;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\DocumentBody;
use Domain\Documents\Values\CreatedRecord;

final readonly class CreateDocumentHandler extends DocumentCommandHandler
{
    public function __construct(
        private RecordLinker $links,
        private SessionProvenance $provenance,
        private DocumentBody $bodies,
    ) {}

    public function handle(CreateDocumentCommand $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $body = $this->bodies->read($command->body, $command->uploadId, UploadType::DocumentBody);
        $document = Document::create($actor, $command->owner());

        $document->startWith(DocumentRevision::create(
            $document,
            trim($command->title),
            trim($command->abstract),
            MarkdownText::body($body)->text,
            $actor->actorType(),
            $actor->actorId(),
        ));

        $this->provenance->record($document);
        $this->provenance->record(DocumentRevision::findCurrentOf($document));
        $this->links->linkFrom($document, $command->relatedRecords);

        return new CreatedRecord($document->id, $document->number, 'doc');
    }
}
