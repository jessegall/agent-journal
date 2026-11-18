<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Models\Share;

/**
 * Sharing's authority: the current configured owner, as Core's journal access policy names them, manages every
 * share, and a share's grant holds only while the user who granted it is still that owner. Whether a record may be
 * disclosed is asked of the record's own provider.
 */
final readonly class OwnerSharePolicy implements SharePolicy
{
    public function __construct(
        private JournalAccessPolicy $access,
        private ShareRecordRegistry $records,
    ) {}

    public function mayManage(Actor $actor): bool
    {
        return $this->access->allows($actor);
    }

    /**
     * @throws SharingNotAllowed
     */
    public function requireManager(Actor $actor): void
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
        return $share->isGrantedByOneOf($this->access->allowedUserIds());
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function mayDisclose(RecordIdentity $record): bool
    {
        return $this->records->provider($record->type)->mayDisclose($record);
    }
}
