<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;

/**
 * What the owner of a shareable record type answers for sharing, through its own public-disclosure queries: the
 * preview of a root, batches of linked targets, pages of owned children and published content, each charged to the
 * budget it is handed.
 */
interface ShareRecordProvider
{
    /**
     * Whether the record may be disclosed publicly now, by this record type's own policy.
     */
    public function mayDisclose(RecordIdentity $record): bool;

    public function preview(ShareSelection $selection, ShareBudget $budget): ShareCandidates;

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords;

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords;

    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent;
}
