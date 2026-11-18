<?php

declare(strict_types=1);

namespace App\Comments\Support;

use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;

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
