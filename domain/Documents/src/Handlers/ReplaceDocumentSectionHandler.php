<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;

final readonly class ReplaceDocumentSectionHandler implements CommandHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ReplaceDocumentSection $command): DraftReference
    {
        return $this->drafts->saveEdit(
            $command->draft,
            fn (DraftText $text) => $text->withSectionReplaced($command->section, $command->body),
        );
    }
}
