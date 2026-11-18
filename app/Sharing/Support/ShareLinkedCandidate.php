<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

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
     * Whether the candidate's record is one of these ids.
     *
     * @param  list<string>  $recordIds
     */
    public function isAmong(array $recordIds): bool
    {
        return in_array($this->card->record->id, $recordIds, true);
    }

    /**
     * Whether the candidate's link is one of these approved links.
     *
     * @param  list<string>  $approvedLinkIds
     */
    public function isApprovedAmong(array $approvedLinkIds): bool
    {
        return in_array($this->linkId, $approvedLinkIds, true);
    }

    /**
     * This candidate as the owner selected it: the record, its link and its published version.
     */
    public function toSelectedTarget(): ShareSelectedTarget
    {
        return new ShareSelectedTarget($this->card->record, $this->linkId, $this->card->publicationVersion);
    }
}
