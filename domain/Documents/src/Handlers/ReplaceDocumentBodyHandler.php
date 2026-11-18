<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\DraftReference;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Support\MarkdownText;

final readonly class ReplaceDocumentBodyHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ReplaceDocumentBody $command): DraftReference
    {
        return $this->drafts->saveEdit($command->draft, fn (DraftText $text) => $text->withBody(MarkdownText::body($command->body)));
    }
}
