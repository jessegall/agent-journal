<?php

declare(strict_types=1);

namespace App\Desks\Models;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Models\AssignmentRecord;
use App\Desks\Contracts\Desk;
use App\Desks\Exceptions\DeskUnavailable;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One numbered seat of a desk. The actor sitting in it is the holder of its Core assignment.
 *
 * @property string $id
 * @property string $desk_id
 * @property int $number
 */
#[Table('desk_seats')]
#[Fillable(['desk_id', 'number'])]
final class DeskSeat extends Model implements Assignable, ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.desk-seat';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['number' => 'integer'];
    }

    public static function openAt(Desk $desk, int $number): self
    {
        $seat = new self(['desk_id' => $desk->deskId(), 'number' => $number]);
        $seat->save();

        return $seat;
    }

    // ----------[ Queries ]----------

    /**
     * One seat of a desk.
     *
     * @throws DeskUnavailable
     */
    public static function ofDeskById(Desk $desk, string $seatId): self
    {
        return self::query()->ofDesk($desk)->whereKey($seatId)->firstOr(
            fn () => throw DeskUnavailable::forSeat($seatId),
        );
    }

    // ----------[ Answers ]----------

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    // ----------[ Scopes ]----------

    /**
     * The seats of one desk.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDesk(Builder $query, Desk $desk): void
    {
        $query->where('desk_id', $desk->deskId());
    }

    /**
     * The seats of a desk nobody holds, lowest number first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function vacant(Builder $query): void
    {
        $query->whereNotIn('id', AssignmentRecord::query()->assignedRecordIds(self::LINK_TYPE))->orderBy('number');
    }
}
