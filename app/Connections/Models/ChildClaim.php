<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Agents\Values\CommitObservation;
use App\Agents\Values\WorkspaceFacts;
use App\Connections\Enums\ChildRole;
use App\Connections\Exceptions\ChildClaimRefused;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One child dispatched for a connected parent: the parent runtime and its generation, the child and its role, the
 * binding, the verified commit it starts from and whether the parent was dirty then, and its ancestry: the claim
 * above it and the root runtime of the chain.
 *
 * @property string $id
 * @property string $parent_runtime_id
 * @property int $parent_generation
 * @property string $child_agent_id
 * @property ChildRole $role
 * @property string $binding_id
 * @property string $base_oid
 * @property bool $parent_was_dirty
 * @property string|null $parent_claim_id
 * @property string $root_runtime_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'parent_runtime_id', 'parent_generation', 'child_agent_id', 'role', 'binding_id', 'base_oid', 'parent_was_dirty',
    'parent_claim_id', 'root_runtime_id',
])]
final class ChildClaim extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['parent_generation' => 'integer', 'role' => ChildRole::class, 'parent_was_dirty' => 'boolean'];
    }

    /**
     * A child of a main runtime, starting from the commit the parent's fresh version 2 read verified; a dirty parent
     * dispatches its committed HEAD.
     *
     * @throws ChildClaimRefused
     */
    public static function ofMain(
        ProjectBinding $binding,
        string $parentRuntimeId,
        string $agentId,
        ChildRole $role,
        WorkspaceFacts $read,
    ): self {
        return self::issue($binding, $parentRuntimeId, $agentId, $role, $read, null, $parentRuntimeId);
    }

    /**
     * A nested child of a child: its grant narrows to it, and it names its parent claim and the chain's root.
     *
     * @throws ChildClaimRefused
     */
    public static function nestedUnder(self $parent, string $agentId, ChildRole $role, WorkspaceFacts $read): self
    {
        $binding = ProjectBinding::query()->whereKey($parent->binding_id)->firstOrFail();

        return self::issue($binding, $parent->id, $agentId, $role, $read, $parent->id, $parent->root_runtime_id);
    }

    // ----------[ Answers ]----------

    /**
     * Refuses a claim whose parent's HEAD moved since the read: the old reference is never reinterpreted.
     *
     * @throws ChildClaimRefused
     */
    public function assertBaseIsHead(CommitObservation $now): void
    {
        if ($now->headOid !== $this->base_oid) {
            throw ChildClaimRefused::baseMoved($this->base_oid, $now->headOid);
        }
    }

    // ----------[ Internals ]----------

    /**
     * @throws ChildClaimRefused
     */
    private static function issue(
        ProjectBinding $binding,
        string $parentRuntimeId,
        string $agentId,
        ChildRole $role,
        WorkspaceFacts $read,
        string|null $parentClaimId,
        string $rootRuntimeId,
    ): self {
        if ($read->commit->reason === CommitObservation::UNBORN) {
            throw ChildClaimRefused::firstCommitMissing();
        }

        if (! $read->commit->authorizesCommitDispatch()) {
            throw ChildClaimRefused::notACommitRead();
        }

        $claim = new self();
        $claim->parent_runtime_id = $parentRuntimeId;
        $claim->parent_generation = $read->generation;
        $claim->child_agent_id = $agentId;
        $claim->role = $role;
        $claim->binding_id = $binding->id;
        $claim->base_oid = $read->commit->headOid;
        $claim->parent_was_dirty = $read->isDirty;
        $claim->parent_claim_id = $parentClaimId;
        $claim->root_runtime_id = $rootRuntimeId;
        $claim->save();

        return $claim;
    }
}
