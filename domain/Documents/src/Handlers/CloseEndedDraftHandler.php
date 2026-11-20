<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Support\SessionProvenance;
use App\Contracts\CommandHandler;
use Domain\Documents\Commands\CloseEndedDraft;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\DraftClosing;

final readonly class CloseEndedDraftHandler implements CommandHandler
{
    public function __construct(private DraftClosing $drafts, private SessionProvenance $provenance) {}

    public function handle(CloseEndedDraft $command): void
    {
        $ended = $command->ended;
        $drafts = DocumentDraft::query()->with('document')->heldByAgent($ended->agentId);
        $draft = $this->provenance->fromSession($drafts, $ended->sessionId)->first();

        if ($draft !== null) {
            $this->drafts->closeEnded($draft);
        }
    }
}
