<?php

declare(strict_types=1);

namespace Domain\Access\Models;

use App\Concerns\BoundedReads;
use App\Concerns\GrantedInEnvironment;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\InboxPermission;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Events\EnvironmentUserGrantRevoked;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property string $environment_key
 * @property bool $can_open_inboxes
 * @property bool $can_manage_members
 * @property bool $can_receive_invitations
 * @property string $granted_by_type
 * @property string $granted_by_id
 * @property CarbonImmutable $granted_at
 * @property ?CarbonImmutable $revoked_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'user_id',
    'environment_key',
    'can_open_inboxes',
    'can_manage_members',
    'can_receive_invitations',
    'granted_by_type',
    'granted_by_id',
    'granted_at',
])]
final class EnvironmentUserGrant extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use GrantedInEnvironment;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LOCAL_ENVIRONMENT = '';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'can_open_inboxes' => 'boolean',
            'can_manage_members' => 'boolean',
            'can_receive_invitations' => 'boolean',
            'granted_at' => 'immutable_datetime',
            'revoked_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Admits the user to the environment with the given permissions; the grant it replaces is revoked by the caller.
     *
     * @param  list<InboxPermission>  $permissions
     */
    public static function create(
        User $user,
        string|null $environmentId,
        array $permissions,
        ActorIdentity $grantedBy,
        CarbonImmutable $at,
    ): self {
        $grant = new self([
            'user_id' => $user->id,
            'environment_key' => $environmentId ?? self::LOCAL_ENVIRONMENT,
            ...self::columnsOf($permissions),
            'granted_by_type' => $grantedBy->type->value,
            'granted_by_id' => $grantedBy->id,
            'granted_at' => $at,
        ]);

        $grant->save();

        return $grant;
    }

    // ----------[ Mutations ]----------

    public function revoke(CarbonImmutable $at): void
    {
        $this->revoked_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new EnvironmentUserGrantRevoked($this->id));
    }

    // ----------[ Predicates ]----------

    public function allows(InboxPermission $permission): bool
    {
        return (bool) $this->getAttribute($permission->column());
    }

    // ----------[ Internals ]----------

    /**
     * @param  list<InboxPermission>  $permissions
     * @return array<string, bool>
     */
    private static function columnsOf(array $permissions): array
    {
        $columns = [];

        foreach (InboxPermission::cases() as $permission) {
            $columns[$permission->column()] = in_array($permission, $permissions, true);
        }

        return $columns;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function activeFor(Builder $query, string $userId, string|null $environmentId): void
    {
        $query->where('user_id', $userId)->inEnvironment($environmentId);
    }

    /**
     * The grants that allow the permission.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function allowing(Builder $query, InboxPermission $permission): void
    {
        $query->where($permission->column(), true);
    }

    /**
     * Only the user of each grant, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function userIds(Builder $query): void
    {
        $query->select('user_id');
    }
}
