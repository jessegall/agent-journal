<?php

declare(strict_types=1);

namespace App\Models\Desks;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Chat\Desk;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\MorphPivot;

/**
 * The desk an actor prefers to receive its messages at, joining the actor to that desk; one per actor.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $desk_id
 */
#[Fillable(['desk_id'])]
#[Table('desk_preferences')]
final class DeskPreference extends MorphPivot implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.desk-preference';

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Makes the desk the actor's preferred desk, replacing an earlier preference.
     */
    public static function create(ActorIdentity $actor, Desk $desk): self
    {
        $preference = new self(['desk_id' => $desk->deskId()]);
        $preference->belongTo($actor);
        $preference->save();

        return $preference;
    }

    /**
     * The actor's preference, locked, when they have one.
     */
    public static function lockedOf(ActorIdentity $actor): self|null
    {
        return self::query()->ownedBy($actor)->lockForUpdate()->first();
    }

    // ----------[ Queries ]----------

    /**
     * Whether the actor prefers this desk.
     */
    public static function isPreferredBy(ActorIdentity $actor, Desk $desk): bool
    {
        return self::query()->ownedBy($actor)->where('desk_id', $desk->deskId())->exists();
    }

    // ----------[ Mutations ]----------

    public function switchTo(Desk $desk): void
    {
        $this->desk_id = $desk->deskId();
        $this->save();
    }
}
