<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
     * @param  list<string>  $bindingIds
     * @return list<self>
     */
    public static function newestOfBindings(array $bindingIds): array
    {
        return array_values(self::query()->whereIn('binding_id', $bindingIds)
            ->orderByDesc('created_at')->orderByDesc('id')
            ->limit(count($bindingIds) * self::SUPPORT_RECORD_LIMIT)->get()->all());
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
