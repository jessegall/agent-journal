<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\CurrentActor;
use App\Contracts\SessionProvenance;
use App\Support\ActorIdentity;
use Domain\Documents\Models\DocumentDraft;
use Illuminate\Container\Attributes\Scoped;

/**
 * The editor of this request: its actor, and for an agent the session of its signed call; a user has no session.
 */
#[Scoped]
final readonly class RequestEditor
{
    public function __construct(private CurrentActor $actors, private SessionProvenance $provenance) {}

    public function editor(): ActorIdentity
    {
        return ActorIdentity::of($this->actors->actor());
    }

    public function isEditing(DocumentDraft $draft): bool
    {
        $editor = $this->editor();

        return $draft->isEditedBy($editor)
            && (! $editor->type->isAgent() || $this->provenance->isFromCurrentSession($draft));
    }
}
