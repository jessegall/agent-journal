<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\EditDocument;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Support\DocumentBody;
use Domain\Documents\Support\DraftEditor;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\DraftReference;

final readonly class EditDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private DraftEditor $drafts, private DocumentBody $bodies) {}

    public function handle(EditDocumentCommand $command): DraftReference
    {
        return $this->drafts->saveEdit(
            $command->draft,
            fn (DraftText $draft) => $draft->withSectionReplaced(
                $command->section,
                $this->bodies->read($command->body, $command->uploadId, UploadType::EditReplacement),
            ),
        );
    }
}
