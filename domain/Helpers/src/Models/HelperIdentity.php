<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Domain\Helpers\Exceptions\HelperIdentityFixed;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * A helper of one parent actor, declared from a profile for the lasting agent actor it represents; its parent, profile
 * key, base and actor never change, idle or retired. Only its parent reads it; the helper's own responsibility for a
 * job is a Core assignment.
 *
 * @property string $id
 * @property string $profile_key
 * @property string $profile_base
 * @property string $helper_actor_type
 * @property string $helper_actor_id
 * @property string|null $designated_profile
 */
#[Table('helper_identities')]
#[Fillable(['profile_key', 'profile_base'])]
final class HelperIdentity extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * The columns a declared identity never changes.
     */
    private const array FIXED_COLUMNS = [
        'actor_type',
        'actor_id',
        'profile_key',
        'profile_base',
        'helper_actor_type',
        'helper_actor_id',
    ];

    // ----------[ Constructors ]----------

    protected static function booted(): void
    {
        self::updating(function (self $identity): void {
            if ($identity->isDirty(self::FIXED_COLUMNS)) {
                throw HelperIdentityFixed::forIdentity($identity->id);
            }
        });
    }

    /**
     * Declares the parent's helper for the agent actor it represents; Agents offers it only while that actor is an
     * agent with the same profile key.
     */
    public static function create(
        ActorIdentity $parent,
        ActorIdentity $helper,
        string $profileKey,
        string $profileBase,
    ): self {
        $identity = new self();
        $identity->profile_key = $profileKey;
        $identity->profile_base = $profileBase;
        $identity->helper_actor_type = $helper->type->value;
        $identity->helper_actor_id = $helper->id;
        $identity->belongTo($parent);
        $identity->save();

        return $identity;
    }

    // ----------[ Queries ]----------

    /**
     * The helper designated for the profile, whoever holds it.
     *
     * @return Option<self>
     */
    public static function designatedFor(string $profileKey): Option
    {
        return Option::fromValue(self::query()->acrossActors()->where('designated_profile', $profileKey)->first());
    }

    // ----------[ Mutations ]----------

    /**
     * Makes this the one helper the whole installation keeps for a profile whose instances are single; the unique
     * designation refuses a second one.
     */
    public function designate(): self
    {
        $this->designated_profile = $this->profile_key;
        $this->save();

        return $this;
    }

    /**
     * Gives up this helper's designation once its agent retired, so a replacement can take it; a designation another
     * transaction already moved is left alone.
     */
    public function releaseDesignation(): void
    {
        if ($this->designated_profile === null) {
            return;
        }

        $this->designated_profile = null;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The lasting actor this identity represents.
     */
    public function helperActor(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->helper_actor_type), $this->helper_actor_id);
    }

    // ----------[ Scopes ]----------

    /**
     * The parent's identities of one profile key and base, the only ones a start may reuse for that profile.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, string $profileKey, string $base): void
    {
        $query->where('profile_key', $profileKey)->where('profile_base', $base);
    }

    /**
     * The identity that represents the actor, if the parent has one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function representing(Builder $query, ActorIdentity $helper): void
    {
        $query->where('helper_actor_type', $helper->type->value)->where('helper_actor_id', $helper->id);
    }
}
