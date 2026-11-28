<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ReplaceDocumentText;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftEditor;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\DraftReference;

final readonly class ReplaceDocumentTextHandler extends DocumentCommandHandler
{
    public function __construct(private DraftEditor $drafts) {}

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
