<?php

declare(strict_types=1);

namespace App\Desks\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\Desk;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
#[Table('desk_preferences')]
#[Fillable(['desk_id'])]
final class DeskPreference extends MorphPivot implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.desk-preference';

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

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
    public static function prefer(ActorIdentity $actor, Desk $desk): self
    {
        $preference = self::query()->ownedBy($actor)->lockForUpdate()->first();

        if ($preference !== null) {
            $preference->switchTo($desk);

            return $preference;
        }

        $preference = new self(['desk_id' => $desk->deskId()]);
        $preference->belongTo($actor);
        $preference->save();

        return $preference;
    }

    /**
     * Whether the actor prefers this desk.
     */
    public static function isPreferredBy(ActorIdentity $actor, Desk $desk): bool
    {
        return self::query()->ownedBy($actor)->where('desk_id', $desk->deskId())->exists();
    }

    public function switchTo(Desk $desk): void
    {
        $this->desk_id = $desk->deskId();
        $this->save();
    }
}
