<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\DraftReference;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Support\DraftEditing;
use Domain\Documents\Support\DraftText;

final readonly class ChangeDocumentDetailsHandler
{
    public function __construct(private DraftEditing $drafts) {}

    public function handle(ChangeDocumentDetails $command): DraftReference
    {
        return $this->drafts->saveEdit($command->draft, fn (DraftText $text) => $text->withDetails($command->title, $command->abstract));
    }
}
