<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One skill write an actor sent under a request id: the digest of what it sent and the skill revision it produced, so a
 * retry with the same id answers the same result and a reuse with other content is told apart. It keeps no body.
 *
 * @property string $id
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string $request_id
 * @property string $input_digest
 * @property string $skill_id
 * @property string $skill_revision_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['actor_type', 'actor_id', 'request_id', 'input_digest', 'skill_id', 'skill_revision_id'])]
final class SkillRequest extends Model implements ReadableModel
{
    use BoundedReads, HasActorColumns, HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'actor_type' => ActorType::class,
        ];
    }

    public static function record(
        ActorIdentity $actor,
        string $requestId,
        string $inputDigest,
        SkillRevision $revision,
    ): self {
        return self::query()->create([
            'actor_type' => $actor->type,
            'actor_id' => $actor->id,
            'request_id' => $requestId,
            'input_digest' => $inputDigest,
            'skill_id' => $revision->skill_id,
            'skill_revision_id' => $revision->id,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The actor's earlier write under this request id, or null when it sent none.
     */
    public static function earlier(ActorIdentity $actor, string $requestId): self|null
    {
        return self::query()->byActor($actor)->where('request_id', $requestId)->first();
    }

    // ----------[ Answers ]----------

    public function sentWith(string $inputDigest): bool
    {
        return hash_equals($this->input_digest, $inputDigest);
    }
}
