<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Records\Contracts\ShareBudget;
use App\Records\Contracts\ShareRecordProvider;
use App\Support\RecordIdentity;
use App\Support\ShareContentRequest;
use App\Support\SharedContent;
use App\Support\ShareRecordCard;
use App\Support\ShareRecords;
use App\Support\ShareRelationRequest;
use App\Support\ShareSelection;
use App\Support\ShareTargetRequest;
use App\Values\ProjectOwner;

/**
 * Discloses pamphlets but not their notes, and answers every pamphlet as one fixed published card with no linked
 * or owned records.
 */
final class PamphletShareProvider implements ShareRecordProvider
{
    public function mayDisclose(RecordIdentity $record): bool
    {
        return $record->type === 'pamphlets.pamphlet';
    }

    public function ownerOf(RecordIdentity $record): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        return $this->card($selection->root);
    }

    public function readTargets(ShareTargetRequest $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    public function readRelated(ShareRelationRequest $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    public function content(ShareContentRequest $read, ShareBudget $budget): SharedContent
    {
        return new SharedContent($this->card($read->record), 'A pamphlet.');
    }

    private function card(RecordIdentity $record): ShareRecordCard
    {
        return new ShareRecordCard($record, 'Pamphlet', '1');
    }
}
