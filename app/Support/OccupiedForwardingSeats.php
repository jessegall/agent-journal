<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Models\AssignmentRecord;
use App\Models\DeskRecord;
use App\Models\DeskSeat;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The seat an actor holds at a forwarding desk, read once: an actor holds one such seat at most.
 */
final readonly class OccupiedForwardingSeats
{
    /**
     * @return Option<OccupiedSeat>
     */
    public function forActor(Actor $actor): Option
    {
        $seats = DeskSeat::query()->select('id')->whereIn('desk_id', DeskRecord::query()->forwarding()->select('id'));

        $held = AssignmentRecord::query()
            ->assignedAmong(DeskSeat::LINK_TYPE, $seats)
            ->heldBy(AssigneeIdentity::of($actor))
            ->first();

        return $held === null ? None::create() : Some::create(self::occupied($held));
    }

    private static function occupied(AssignmentRecord $row): OccupiedSeat
    {
        $assignment = $row->toAssignment();
        $seat = DeskSeat::query()->whereKey($assignment->record->id)->sole();

        return new OccupiedSeat(DeskRecord::query()->whereKey($seat->desk_id)->sole(), $assignment->reference);
    }
}
