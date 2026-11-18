<?php

declare(strict_types=1);

namespace Domain\Documents\Listeners;

use App\Agents\Events\LaunchEnded;
use App\Contracts\Listener;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\DraftClosing;

/**
 * Closes the draft an agent held in a session that ended (an author holds one draft at a time), inside the transaction that ends it: a changed draft
 * becomes the next revision under that agent, an unchanged one leaves none. A failure here rolls the ending back.
 */
final readonly class CloseEndedSessionDraft implements Listener
{
    public function __construct(private DraftClosing $drafts) {}

    public function handle(LaunchEnded $event): void
    {
        $draft = DocumentDraft::query()->with('document')->heldBySession($event->agentId, $event->sessionId)->first();

        if ($draft !== null) {
            $this->drafts->closeEnded($draft);
        }
    }
}
