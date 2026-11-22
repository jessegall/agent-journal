<?php

declare(strict_types=1);

namespace Domain\Access\Models;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One user's admission to the chats of one environment, with what it may do there, until it is revoked. A user holds
 * at most one active grant per environment; a new grant replaces the old one.
 *
 * @property string $id
 * @property string $user_id
 * @property string $environment_key
 * @property bool $can_create_chats
 * @property bool $can_manage_members
 * @property bool $can_receive_invitations
 * @property string $granted_by_type
 * @property string $granted_by_id
 * @property CarbonImmutable $granted_at
 * @property CarbonImmutable|null $revoked_at
 */
#[Fillable([
    'user_id',
    'environment_key',
    'can_create_chats',
    'can_manage_members',
    'can_receive_invitations',
    'granted_by_type',
    'granted_by_id',
    'granted_at',
])]
final class EnvironmentUserGrant extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    public const string LOCAL_ENVIRONMENT = '';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'can_create_chats' => 'boolean',
            'can_manage_members' => 'boolean',
            'can_receive_invitations' => 'boolean',
            'granted_at' => 'immutable_datetime',
            'revoked_at' => 'immutable_datetime',
        ];
    }

    /**
     * Admits the user to the environment with the given permissions, replacing the grant it held there.
     *
     * @param  list<ChatPermission>  $permissions
     */
    public static function grant(
        User $user,
        string|null $environmentId,
        array $permissions,
        ActorIdentity $grantedBy,
        CarbonImmutable $at,
    ): self {
        self::query()->activeFor($user->id, $environmentId)->first()?->revoke($at);

        $grant = new self([
            'user_id' => $user->id,
            'environment_key' => $environmentId ?? self::LOCAL_ENVIRONMENT,
            ...self::columnsOf($permissions),
            ...$grantedBy->asColumns('granted_by'),
            'granted_at' => $at,
        ]);

        $grant->save();

        return $grant;
    }

    // ----------[ Mutations ]----------

    public function revoke(CarbonImmutable $at): void
    {
        $this->revoked_at = $at;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function allows(ChatPermission $permission): bool
    {
        return (bool) $this->getAttribute($permission->column());
    }

    // ----------[ Internals ]----------

    /**
     * @param  list<ChatPermission>  $permissions
     * @return array<string, bool>
     */
    private static function columnsOf(array $permissions): array
    {
        $columns = [];

        foreach (ChatPermission::cases() as $permission) {
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
     * The active grants of an environment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inEnvironment(Builder $query, string|null $environmentId): void
    {
        $query->where('environment_key', $environmentId ?? self::LOCAL_ENVIRONMENT)->whereNull('revoked_at');
    }
}
