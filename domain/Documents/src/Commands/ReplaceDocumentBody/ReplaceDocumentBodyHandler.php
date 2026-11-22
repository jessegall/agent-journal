<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ReplaceDocumentBody;

use App\Support\MarkdownText;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\DraftReference;

final readonly class ReplaceDocumentBodyHandler extends DocumentCommandHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ReplaceDocumentBodyCommand $command): DraftReference
    {
        return $this->drafts->saveEdit(
            $command->draft,
            fn (DraftText $text) => $text->withBody(MarkdownText::workingBody($command->body)),
        );
    }
}
