<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\ChangeDocumentDetails;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftEditor;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\DraftReference;

final readonly class ChangeDocumentDetailsHandler extends DocumentCommandHandler
{
    public function __construct(private DraftEditor $drafts) {}

    public function handle(ChangeDocumentDetailsCommand $command): DraftReference
    {
        return $this->drafts->saveEdit(
            $command->draft,
            fn (DraftText $text) => $text->withDetails($command->title, $command->abstract),
        );
    }
}
