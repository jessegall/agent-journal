<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Enums\Connections\ConnectionAuditActor;
use App\Enums\Connections\ConnectionAuditType;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property ConnectionAuditType $type
 * @property ConnectionAuditActor $actor_type
 * @property string $actor_id
 * @property ?string $invitation_id
 * @property ?string $binding_id
 * @property string $outcome
 * @property Carbon $created_at
 * @property ?string $project_id
 */
final class ConnectionAudit extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;

    public const string DONE = 'done';

    public const ?string UPDATED_AT = null;

    /**
     * The most steps of one folder its support record shows.
     */
    public const int SUPPORT_RECORD_LIMIT = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ConnectionAuditType::class,
            'actor_type' => ConnectionAuditActor::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A step the owner took on an install line.
     */
    public static function createForInvitation(ConnectionAuditType $type, string $userId, ProjectInvitation $invitation): self
    {
        return self::record(
            $type,
            ConnectionAuditActor::User,
            $userId,
            $invitation->id,
            $invitation->project_id,
            $invitation->binding_id,
        );
    }

    /**
     * A step the owner or a binding's host took on the binding.
     */
    public static function createForBinding(
        ConnectionAuditType $type,
        ConnectionAuditActor $actorType,
        string $actorId,
        ProjectBinding $binding,
    ): self {
        return self::record($type, $actorType, $actorId, null, $binding->project_id, $binding->id);
    }

    // ----------[ Internals ]----------

    private static function record(
        ConnectionAuditType $type,
        ConnectionAuditActor $actorType,
        string $actorId,
        string|null $invitationId,
        string|null $projectId,
        string|null $bindingId,
    ): self {
        $audit = new self();
        $audit->type = $type;
        $audit->actor_type = $actorType;
        $audit->actor_id = $actorId;
        $audit->invitation_id = $invitationId;
        $audit->project_id = $projectId;
        $audit->binding_id = $bindingId;
        $audit->outcome = self::DONE;
        $audit->save();

        return $audit;
    }

    // ----------[ Queries ]----------

    /**
     * The newest steps first, at most this many.
     *
     * @return list<self>
     */
    public static function newest(int $most): array
    {
        return array_values(self::query()->newestFirst()->limit($most)->get()->all());
    }

    /**
     * The newest steps on these bindings, newest first, at most SUPPORT_RECORD_LIMIT for each one shown.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function newestOfBindings(array $ids): array
    {
        $ranked = self::query()->select('*')
            ->selectRaw('row_number() over (partition by binding_id order by created_at desc, id desc) as step_rank')
            ->ofBindings($ids);

        return array_values(self::query()->fromSub($ranked, 'connection_audits')
            ->rankedWithinSupportLimit()
            ->newestFirst()
            ->readExactly(count($ids) * self::SUPPORT_RECORD_LIMIT)->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The audits of the bindings.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofBindings(Builder $query, array $ids): void
    {
        $query->whereIn('binding_id', $ids);
    }

    /**
     * The ranked audits among each binding's newest the support record keeps.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function rankedWithinSupportLimit(Builder $query): void
    {
        $query->where('step_rank', '<=', self::SUPPORT_RECORD_LIMIT);
    }
}
