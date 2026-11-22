<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Chat\Desk;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\DeskUnavailable;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * A desk: its optional unique name, its label, the inbox it receives messages at and how many seats it has. Who sits
 * at it is held by Core assignments of its seats, never by a column here.
 *
 * @property string $id
 * @property string|null $name
 * @property string $label
 * @property string $inbox_id
 * @property int $seat_count
 * @property bool $forwards_occupants
 * @property int $seating_revision
 */
#[Table('desks')]
#[Fillable(['name', 'label', 'inbox_id', 'seat_count', 'forwards_occupants', 'seating_revision'])]
final class DeskRecord extends Model implements Desk, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.desk';

    public const string ASSIGNEE_TYPE = 'desk';

    public const string INBOX_PROVIDER = 'desk';

    public const int LARGEST_SEAT_COUNT = 100;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'seat_count' => 'integer',
            'forwards_occupants' => 'boolean',
            'seating_revision' => 'integer',
        ];
    }

    /**
     * The desk's own row, with the inbox made for it and its seat count already checked.
     */
    public static function create(
        string $id,
        string|null $name,
        string $label,
        string $inboxId,
        int $seatCount,
        bool $forwardsOccupants,
    ): self {
        $desk = new self();
        $desk->id = $id;
        $desk->name = $name;
        $desk->label = $label;
        $desk->inbox_id = $inboxId;
        $desk->seat_count = $seatCount;
        $desk->forwards_occupants = $forwardsOccupants;
        $desk->seating_revision = 0;
        $desk->save();

        return $desk;
    }

    // ----------[ Queries ]----------

    /**
     * The desk under an exclusive lock, so its seating cannot change under a seat change.
     *
     * @throws DeskUnavailable
     */
    public static function lockedForSeating(string $deskId): self
    {
        return self::query()->whereKey($deskId)->lockForUpdate()->firstOr(
            fn () => throw DeskUnavailable::forId($deskId),
        );
    }

    /**
     * The desk the actor prefers, when it has one.
     *
     * @return Option<self>
     */
    public static function preferredBy(ActorIdentity $actor): Option
    {
        return Option::fromValue(self::query()->whereIn(
            'id',
            DeskPreference::query()->ownedBy($actor)->select('desk_id'),
        )->first());
    }

    // ----------[ Mutations ]----------

    public function advanceSeating(): void
    {
        $this->seating_revision++;
        $this->save();
    }

    public function rename(string $label): void
    {
        $this->label = $label;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * An actor's own desk: unnamed, with one seat.
     */
    public function isPersonal(): bool
    {
        return $this->name === null && $this->seat_count === 1;
    }

    public function deskId(): string
    {
        return $this->id;
    }

    public function seatCount(): int
    {
        return $this->seat_count;
    }

    public function inboxId(): string
    {
        return $this->inbox_id;
    }

    public function inboxLabel(): string
    {
        return $this->label;
    }

    public function assigneeIdentity(): AssigneeIdentity
    {
        return new AssigneeIdentity(self::ASSIGNEE_TYPE, $this->id);
    }

    // ----------[ Scopes ]----------

    /**
     * The desks the actor holds a seat at.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function occupiedBy(Builder $query, ActorIdentity $actor): void
    {
        $query->seatedAssignee(AssigneeIdentity::ofActorIdentity($actor));
    }

    /**
     * The desks the assignee holds a seat at.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function seatedAssignee(Builder $query, AssigneeIdentity $member): void
    {
        $seats = DeskSeat::query()
            ->select('desk_id')
            ->whereIn('id', AssignmentRecord::query()->heldRecordIds(DeskSeat::LINK_TYPE, $member));

        $query->whereIn('id', $seats);
    }

    /**
     * The desk of this name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }

    /**
     * The desks whose seated actors forward their work and messages to them.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forwarding(Builder $query): void
    {
        $query->where('forwards_occupants', true);
    }
}
