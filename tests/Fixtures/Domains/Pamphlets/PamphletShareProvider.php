<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;

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

    public function preview(ShareSelection $selection, ShareBudget $budget): ShareCandidates
    {
        return new ShareCandidates($this->card($selection->root), []);
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        return new SharedContent($this->card($read->record), 'A pamphlet.');
    }

    private function card(RecordIdentity $record): ShareRecordCard
    {
        return new ShareRecordCard($record, 'Pamphlet', '1');
    }
}
