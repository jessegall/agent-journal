<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Helpers\Exceptions\HelperIdentityFixed;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A helper of one parent actor, declared from a profile; its profile key and base never change. Only its parent reads
 * it; the helper's own responsibility for a job is a Core assignment.
 *
 * @property string $id
 * @property string $profile_key
 * @property string $profile_base
 */
#[Table('helper_identities')]
#[Fillable(['profile_key', 'profile_base'])]
final class HelperIdentity extends Model implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    protected static function booted(): void
    {
        self::updating(function (self $identity): void {
            if ($identity->isDirty(['profile_key', 'profile_base'])) {
                throw HelperIdentityFixed::forIdentity($identity->id);
            }
        });
    }

    public static function declare(ActorIdentity $parent, string $profileKey, string $profileBase): self
    {
        $identity = new self();
        $identity->profile_key = $profileKey;
        $identity->profile_base = $profileBase;
        $identity->belongTo($parent);
        $identity->save();

        return $identity;
    }
}
