<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $request_id
 * @property string $input_digest
 * @property string $skill_id
 * @property string $skill_revision_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class SkillRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(
        ActorIdentity $actor,
        string $requestId,
        string $inputDigest,
        SkillRevision $revision,
    ): self {
        $skillRequest = new self();
        $skillRequest->actor_type = $actor->type;
        $skillRequest->actor_id = $actor->id;
        $skillRequest->request_id = $requestId;
        $skillRequest->input_digest = $inputDigest;
        $skillRequest->skill_id = $revision->skill_id;
        $skillRequest->skill_revision_id = $revision->id;
        $skillRequest->save();

        return $skillRequest;
    }

    // ----------[ Predicates ]----------

    public function sentWith(string $inputDigest): bool
    {
        return hash_equals($this->input_digest, $inputDigest);
    }

    // ----------[ Queries ]----------

    /**
     * The actor's earlier write under this request id, or null when it sent none.
     */
    public static function earlier(ActorIdentity $actor, string $requestId): self|null
    {
        return self::query()->byActor($actor)->ofRequest($requestId)->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The request made under that request id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRequest(Builder $query, string $requestId): void
    {
        $query->where('request_id', $requestId);
    }
}
