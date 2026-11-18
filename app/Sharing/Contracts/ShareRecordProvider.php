<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;

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
    public function preview(ShareSelection $selection, ShareCharges $budget): ShareRecordCard;

    public function readTargets(ShareTargetRead $read, ShareCharges $budget): ShareRecords;

    public function readRelated(ShareRelationRead $read, ShareCharges $budget): ShareRecords;

    public function content(ShareContentRead $read, ShareCharges $budget): SharedContent;
}
