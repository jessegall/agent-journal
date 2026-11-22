<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ReplaceDocumentText;

use Domain\Documents\Api\DraftReference;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;

final readonly class ReplaceDocumentTextHandler extends DocumentCommandHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ReplaceDocumentTextCommand $command): DraftReference
    {
        return $this->drafts->saveEdit(
            $command->draft,
            fn (DraftText $text) => $text->withBody(
                $text->body->withTextReplaced($command->oldText, $command->newText),
            ),
        );
    }
}
