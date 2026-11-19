<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Concerns;

use App\Actors\Support\ActorIdentity;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Models\DocumentDraft;

/**
 * Refuses a change to a draft another editor holds, or to a version of it that moved on.
 */
trait RefusesOtherDrafts
{
    /**
     * @throws DraftConflict
     */
    private function refuseUnlessDraftEditor(DocumentDraft $draft, ActorIdentity $editor): void
    {
        if (! $draft->isEditedBy($editor)) {
            throw DraftConflict::notYours();
        }
    }

    /**
     * @throws DraftConflict
     */
    private function refuseStaleDraftVersion(DocumentDraft $draft, int $version): void
    {
        if (! $draft->isAtVersion($version)) {
            throw DraftConflict::stale($version, $draft->version);
        }
    }
}
