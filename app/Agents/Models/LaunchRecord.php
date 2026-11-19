<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchDisposition;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Exceptions\LaunchRequestConflict;
use App\Agents\Support\LaunchRequest;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * The durable record of one launch request: who asked for which agent, the selection, its origin and conversation,
 * the digest of its contents and where it stands. It never holds a credential or a secret.
 *
 * @property string $id
 * @property string $request_id
 * @property string $agent_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $program
 * @property string $model
 * @property ModelSelectionType $requested_model_type
 * @property string|null $requested_model
 * @property ProgramSourceType $program_source
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property LaunchOriginType $origin_type
 * @property string|null $owner_reference
 * @property string|null $context_reference
 * @property ConversationModeType $conversation_mode
 * @property string $payload_digest
 * @property LaunchDisposition $disposition
 * @property string|null $session_id
 * @property string|null $reply_inbox_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'request_id',
    'agent_id',
    'actor_type',
    'actor_id',
    'program',
    'model',
    'requested_model_type',
    'requested_model',
    'program_source',
    'profile_key',
    'profile_revision',
    'origin_type',
    'owner_reference',
    'context_reference',
    'conversation_mode',
    'payload_digest',
    'disposition',
    'session_id',
    'reply_inbox_id',
])]
final class LaunchRecord extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requested_model_type' => ModelSelectionType::class,
            'program_source' => ProgramSourceType::class,
            'profile_revision' => 'integer',
            'origin_type' => LaunchOriginType::class,
            'conversation_mode' => ConversationModeType::class,
            'disposition' => LaunchDisposition::class,
        ];
    }

    /**
     * The record of this request: the one already kept under its id when the contents match, else a new accepted one
     * that answers to the requester's reply inbox, fixed from then on.
     *
     * @param  Option<string>  $replyInboxId
     *
     * @throws LaunchRequestConflict
     */
    public static function accept(LaunchRequest $request, ActorIdentity $requester, Option $replyInboxId): self
    {
        $existing = self::query()->where('request_id', $request->requestId)->lockForUpdate()->first();

        if ($existing !== null) {
            return $existing->requireDigest($request);
        }

        $selection = $request->selection;
        $requested = $selection->requested;
        $source = $selection->source;

        return self::query()->create([
            'request_id' => $request->requestId,
            'agent_id' => $request->agentId,
            'actor_type' => $requester->type->value,
            'actor_id' => $requester->id,
            'program' => $selection->program->value,
            'model' => $selection->model,
            'requested_model_type' => $requested->type,
            'requested_model' => $requested->model,
            'program_source' => $source->programSource,
            'profile_key' => $source->profileKey,
            'profile_revision' => $source->profileRevision,
            'origin_type' => $request->origin,
            'owner_reference' => $request->ownerReference,
            'context_reference' => $request->contextReference,
            'conversation_mode' => $request->conversationMode,
            'payload_digest' => $request->digest(),
            'disposition' => LaunchDisposition::Accepted,
            'reply_inbox_id' => $replyInboxId->getOrElse(null),
        ]);
    }

    /**
     * The inbox the launched agent answers to, when its dispatcher had one.
     *
     * @return Option<string>
     */
    public function replyInboxId(): Option
    {
        return Option::fromValue($this->reply_inbox_id);
    }

    public function launchedAs(AgentSession $session): void
    {
        $this->session_id = $session->id;
        $this->disposition = LaunchDisposition::Launched;
        $this->save();
    }

    /**
     * @throws LaunchRequestConflict
     */
    private function requireDigest(LaunchRequest $request): self
    {
        if (! hash_equals($this->payload_digest, $request->digest())) {
            throw LaunchRequestConflict::forRequest($request->requestId);
        }

        return $this;
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forOwnerReference(Builder $query, string $ownerReference): void
    {
        $query->where('owner_reference', $ownerReference);
    }
}
