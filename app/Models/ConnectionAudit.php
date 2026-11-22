<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ConnectionAuditActor;
use App\Enums\ConnectionAuditType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One step of connecting a project: issuing, replacing or revoking a line, redeeming it, recovering a binding or
 * revoking one, approving or revoking a terminal sign-in, with who took it, on which project and binding, when and how
 * it ended. It holds no ticket or its digest, device code, bearer, host secret, credential or canonical root.
 *
 * @property string $id
 * @property ConnectionAuditType $type
 * @property ConnectionAuditActor $actor_type
 * @property string $actor_id
 * @property string|null $invitation_id
 * @property string|null $project_id
 * @property string|null $binding_id
 * @property string $outcome
 * @property CarbonImmutable $created_at
 */
#[Fillable(['type', 'actor_type', 'actor_id', 'invitation_id', 'project_id', 'binding_id', 'outcome'])]
final class ConnectionAudit extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string DONE = 'done';

    public const ?string UPDATED_AT = null;

    /**
     * The most steps of one folder its support record shows.
     */
    public const int SUPPORT_RECORD_LIMIT = 10;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ConnectionAuditType::class,
            'actor_type' => ConnectionAuditActor::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * A step the owner took on an install line.
     */
    public static function ofInvitation(ConnectionAuditType $type, string $userId, ProjectInvitation $invitation): self
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
    public static function ofBinding(
        ConnectionAuditType $type,
        ConnectionAuditActor $actorType,
        string $actorId,
        ProjectBinding $binding,
    ): self {
        return self::record($type, $actorType, $actorId, null, $binding->project_id, $binding->id);
    }

    // ----------[ Queries ]----------

    /**
     * The newest steps first, at most this many.
     *
     * @return list<self>
     */
    public static function newest(int $most): array
    {
        return array_values(self::query()->orderByDesc('created_at')->orderByDesc('id')->limit($most)->get()->all());
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
            ->whereIn('binding_id', $ids);

        return array_values(self::query()->fromSub($ranked, 'connection_audits')
            ->where('step_rank', '<=', self::SUPPORT_RECORD_LIMIT)
            ->orderByDesc('created_at')->orderByDesc('id')
            ->readExactly(count($ids) * self::SUPPORT_RECORD_LIMIT)->get()->all());
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
}
