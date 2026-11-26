<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Support\RecordIdentity;
use App\Support\ShareRecordCard;

/**
 * A linked record the owner may select for a share: its safe card, the record it is linked from and the link itself.
 * A link has no direction of meaning here; it is a linked candidate, never an attachment.
 */
final readonly class ShareLinkedCandidate
{
    public function __construct(
        public ShareRecordCard $card,
        public RecordIdentity $source,
        public string $linkId,
    ) {}

    /**
     * The id of the record the candidate offers to share.
     */
    public function recordId(): string
    {
        return $this->card->record->id;
    }

    /**
     * Whether the candidate's record is one of these ids.
     *
     * @param  list<string>  $recordIds
     */
    public function isAmong(array $recordIds): bool
    {
        return in_array($this->recordId(), $recordIds, true);
    }

    /**
     * Whether the candidate's link is one of these approved links.
     *
     * @param  list<string>  $ids
     */
    public function isApprovedAmong(array $ids): bool
    {
        return in_array($this->linkId, $ids, true);
    }

    /**
     * This candidate as the owner selected it: the record, its link and its published version.
     */
    public function toSelectedTarget(): ShareSelectedTarget
    {
        return new ShareSelectedTarget($this->card->record, $this->linkId, $this->card->publicationVersion);
    }
}
