<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\DraftReference;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;

final readonly class ReplaceDocumentTextHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ReplaceDocumentText $command): DraftReference
    {
        return $this->drafts->saveEdit($command->draft, fn (DraftText $text) => $text->withBody($text->body->withTextReplaced($command->oldText, $command->newText)));
    }
}
