<?php

declare(strict_types=1);

namespace Domain\Documents\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Sessions\SessionProvenance;
use App\Events\Sessions\SessionClosed;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\DraftCloseService;

/**
 * Closes the draft an agent held in a session that ended (an author holds one draft at a time), inside the transaction
 * that ends it: a changed draft
 * becomes the next revision under that agent, an unchanged one leaves none. A failure here rolls the ending back.
 */
#[InCommandTransaction]
final readonly class CloseEndedSessionDraft implements Listener
{
    public function __construct(private DraftCloseService $drafts, private SessionProvenance $provenance) {}

    public function handle(SessionClosed $event): void
    {
        $drafts = DocumentDraft::query()->withDocument()->heldByAgent($event->agentId);
        $draft = $this->provenance->fromSession($drafts, $event->sessionId)->first();

        if ($draft === null) {
            return;
        }

        $this->drafts->closeEnded($draft);
    }
}
