<?php

declare(strict_types=1);

namespace App\Contracts\Sharing;

use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use App\Support\ShareRecordCard;
use App\Support\ShareRecords;
use App\Support\ShareRelationRead;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;

/**
 * What the owner of a shareable record type answers for sharing, through its own public-disclosure queries: the
 * preview of a root, batches of linked targets, pages of owned children and published content. Core runs each call
 * inside the budget it hands over; the provider charges the bytes and records it loads.
 */
interface ShareRecordProvider
{
    /**
     * Whether the record may be disclosed publicly now, by this record type's own policy.
     */
    public function mayDisclose(RecordIdentity $record): bool;

    /**
     * The root's card for the owner's preview; Core adds the linked candidates it finds through links.
     */
    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard;

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords;

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords;

    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent;
}
