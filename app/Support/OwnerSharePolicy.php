<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Chat\AdmittedRecipients;
use App\Contracts\Sharing\SharePolicy;
use App\Exceptions\SharingNotAllowed;
use App\Exceptions\UnknownShareRecordType;
use App\Models\Share;

/**
 * Sharing's authority: the current configured owner, as Core's journal admission names them, manages every
 * share, and a share's grant holds only while the user who granted it is still that owner. Whether a record may be
 * disclosed is asked of the record's own provider.
 */
final readonly class OwnerSharePolicy implements SharePolicy
{
    public function __construct(
        private JournalAdmission $admission,
        private AdmittedRecipients $recipients,
        private ShareRecordRegistry $records,
    ) {}

    public function mayManage(Actor $actor): bool
    {
        return $this->admission->admits($actor);
    }

    /**
     * @throws SharingNotAllowed
     */
    public function assertManager(Actor $actor): void
    {
        if (! $this->mayManage($actor)) {
            throw SharingNotAllowed::forActor($actor);
        }
    }

    /**
     * Whether the share's grant still holds: false for a proposal, and false once the owner who granted it is no
     * longer the configured owner.
     */
    public function grantHolds(Share $share): bool
    {
        return $share->isGrantedByOneOf($this->recipients->userIds());
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function mayDisclose(RecordIdentity $record): bool
    {
        return $this->records->provider($record->type)->mayDisclose($record);
    }
}
