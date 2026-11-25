<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Domain\Helpers\Events\HelperDesignated;
use Domain\Helpers\Events\HelperDesignationReleased;
use Domain\Helpers\Exceptions\HelperIdentityFixed;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $profile_key
 * @property string $profile_base
 * @property string $helper_actor_type
 * @property string $helper_actor_id
 * @property ?string $designated_profile
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $helper_actor attribute
 */
#[Table('helper_identities')]
final class HelperIdentity extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

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

    protected static function booted(): void
    {
        self::updating(fn (self $identity) => $identity->assertFixedColumnsUnedited());
    }

    // ----------[ Constructors ]----------

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

    // ----------[ Mutations ]----------

    /**
     * Makes this the one helper the whole installation keeps for a profile whose instances are single; the unique
     * designation refuses a second one.
     */
    public function designate(): self
    {
        $this->designated_profile = $this->profile_key;
        $this->assertSaved($this->save());
        $this->raise(new HelperDesignated($this->id));

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
        $this->assertSaved($this->save());
        $this->raise(new HelperDesignationReleased($this->id));
    }

    // ----------[ Accessors ]----------

    /**
     * The lasting actor this identity represents.
     *
     * @return Attribute<ActorIdentity, never>
     */
    protected function helperActor(): Attribute
    {
        return Accessor::get(fn () => new ActorIdentity(ActorType::from($this->helper_actor_type), $this->helper_actor_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an edit of the columns that fix who the helper is.
     *
     * @throws HelperIdentityFixed
     */
    private function assertFixedColumnsUnedited(): void
    {
        if ($this->isDirty(self::FIXED_COLUMNS)) {
            throw HelperIdentityFixed::forIdentity($this->id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The helper designated for the profile, whoever holds it.
     *
     * @return Option<self>
     */
    public static function designatedFor(string $profileKey): Option
    {
        return Option::fromValue(self::query()->acrossActors()->designatedAs($profileKey)->first());
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

    /**
     * The identity designated for the profile.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function designatedAs(Builder $query, string $profileKey): void
    {
        $query->where('designated_profile', $profileKey);
    }
}
