<?php

declare(strict_types=1);

namespace Domain\Comments\Support;

use App\Contracts\Sharing\ShareBudget;
use App\Contracts\Sharing\ShareRecordProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\ShareRecordCard;
use App\Support\ShareRecords;
use App\Support\ShareRelationRead;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;
use App\Support\SharedContent;

/**
 * Comments as share records: they advertise only the parent-bound capability, so a share reaches a comment through
 * its parent's provider alone. On their own they are never a root, never a linked target and never read.
 */
final readonly class CommentShareProvider implements ShareRecordProvider
{
    public const string CAPABILITY = 'share-comment';

    public function mayDisclose(RecordIdentity $record): bool
    {
        return false;
    }

    /**
     * @throws RecordUnavailable
     */
    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        throw RecordUnavailable::forActor($selection->root);
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], $read->targets, null);
    }

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    /**
     * @throws RecordUnavailable
     */
    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        throw RecordUnavailable::forActor($read->record);
    }
}
