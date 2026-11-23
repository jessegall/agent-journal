<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\GrantedInEnvironment;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Whether one agent may take part in chats of one environment, as its operator allowed, and which users there may
 * invite it; the inviters belong to this environment's row, so one environment never authorizes another.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $environment_key
 * @property bool $allows_participation
 * @property string $granted_by_type
 * @property string $granted_by_id
 * @property CarbonImmutable|null $revoked_at
 */
#[Fillable(['agent_id', 'environment_key', 'allows_participation', 'granted_by_type', 'granted_by_id'])]
final class AgentChatPermission extends Model implements ReadableModel
{
    use BoundedReads;
    use GrantedInEnvironment;
    use HasUlids;
    use Linkable;

    public const string LOCAL_ENVIRONMENT = '';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['allows_participation' => 'boolean', 'revoked_at' => 'immutable_datetime'];
    }

    /**
     * Allows the agent into chats of the environment; the permission it replaces is withdrawn by the caller.
     */
    public static function create(
        string $agentId,
        string|null $environmentId,
        ActorIdentity $grantedBy,
        CarbonImmutable $at,
    ): self {
        $permission = new self([
            'agent_id' => $agentId,
            'environment_key' => $environmentId ?? self::LOCAL_ENVIRONMENT,
            'allows_participation' => true,
            ...$grantedBy->asColumns('granted_by'),
        ]);

        $permission->save();

        return $permission;
    }

    // ----------[ Mutations ]----------

    public function withdraw(CarbonImmutable $at): void
    {
        $this->revoked_at = $at;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function admitsInviter(string $userId): bool
    {
        return $this->allows_participation && $this->inviters()->where('user_id', $userId)->exists();
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<AgentChatInviter, $this>
     */
    public function inviters(): HasMany
    {
        return $this->hasMany(AgentChatInviter::class, 'permission_id');
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function activeFor(Builder $query, string $agentId, string|null $environmentId): void
    {
        $query->where('agent_id', $agentId)->inEnvironment($environmentId);
    }
}
