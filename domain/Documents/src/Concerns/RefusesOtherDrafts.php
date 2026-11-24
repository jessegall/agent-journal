<?php

declare(strict_types=1);

namespace Domain\Documents\Concerns;

use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RequestEditor;

/**
 * Refuses a change to a draft another editor holds, or to a version of it that moved on.
 */
trait RefusesOtherDrafts
{
    /**
     * @throws DraftConflict
     */
    private function assertDraftEditor(DocumentDraft $draft, RequestEditor $editors): void
    {
        if (! $editors->isEditing($draft)) {
            throw DraftConflict::ofAnotherActor();
        }
    }

    /**
     * @throws DraftConflict
     */
    private function assertCurrentDraftVersion(DocumentDraft $draft, int $version): void
    {
        if (! $draft->isAtVersion($version)) {
            throw DraftConflict::stale($version, $draft->version);
        }
    }
}
