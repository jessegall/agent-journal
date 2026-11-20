<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\StartRequestConflict;
use App\Agents\Support\StartRequest;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * The durable record of one start request: who asked for which agent, the selection, its origin and conversation,
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
 * @property StartOriginType $origin_type
 * @property string|null $owner_reference
 * @property string|null $context_reference
 * @property ConversationModeType $conversation_mode
 * @property string|null $conversation_target
 * @property bool|null $conversation_resumed
 * @property string $payload_digest
 * @property StartDisposition $disposition
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
    'conversation_target',
    'conversation_resumed',
    'payload_digest',
    'disposition',
    'session_id',
    'reply_inbox_id',
])]
final class StartRecord extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requested_model_type' => ModelSelectionType::class,
            'program_source' => ProgramSourceType::class,
            'profile_revision' => 'integer',
            'origin_type' => StartOriginType::class,
            'conversation_mode' => ConversationModeType::class,
            'conversation_resumed' => 'boolean',
            'disposition' => StartDisposition::class,
        ];
    }

    /**
     * The record of this request: the one already kept under its id when the contents match, else a new accepted one
     * that answers to the requester's reply inbox, fixed from then on.
     *
     * @param  Option<string>  $replyInboxId
     *
     * @throws StartRequestConflict
     */
    public static function accept(StartRequest $request, ActorIdentity $requester, Option $replyInboxId): self
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
            'conversation_target' => $request->conversationTarget,
            'payload_digest' => $request->digest(),
            'disposition' => StartDisposition::Accepted,
            'reply_inbox_id' => $replyInboxId->getOrElse(null),
        ]);
    }

    /**
     * Records whether the session went on in the conversation its start chose: a session that entered another one,
     * or a fresh one, never counts as resumed.
     */
    public static function confirmConversation(string $sessionId, string $nativeId): void
    {
        $start = self::query()->where('session_id', $sessionId)->whereNull('conversation_resumed')->first();

        if ($start === null || $start->conversation_mode !== ConversationModeType::Resume) {
            return;
        }

        $start->conversation_resumed = $start->conversation_target === $nativeId;
        $start->save();
    }

    // ----------[ Queries ]----------

    /**
     * The start an owner made for this session, when the session began from an owner's request.
     *
     * @return Option<self>
     */
    public static function ownerStartOf(string $sessionId): Option
    {
        return Option::fromValue(self::query()
            ->where('session_id', $sessionId)
            ->where('origin_type', StartOriginType::OwnerRequest->value)
            ->whereNotNull('owner_reference')
            ->first());
    }

    /**
     * The native conversation the session's start chose to continue, if it chose one.
     */
    public static function conversationTargetOf(string $sessionId): string|null
    {
        return self::query()->where('session_id', $sessionId)->value('conversation_target');
    }

    /**
     * Whether the session was started to resume an earlier conversation of the same agent.
     */
    public static function resumesConversation(string $sessionId): bool
    {
        return self::query()
            ->where('session_id', $sessionId)
            ->where('conversation_mode', ConversationModeType::Resume->value)
            ->exists();
    }

    // ----------[ Mutations ]----------

    public function startedAs(AgentSession $session): void
    {
        $this->session_id = $session->id;
        $this->disposition = StartDisposition::Started;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The inbox the started agent answers to, when its dispatcher had one.
     *
     * @return Option<string>
     */
    public function replyInboxId(): Option
    {
        return Option::fromValue($this->reply_inbox_id);
    }

    /**
     * The work this start was made for, as its owner names it.
     */
    public function ownerWork(): RecordIdentity
    {
        [$type, $id] = explode(':', (string) $this->owner_reference, 2);

        return new RecordIdentity($type, $id);
    }

    // ----------[ Internals ]----------

    /**
     * @throws StartRequestConflict
     */
    private function requireDigest(StartRequest $request): self
    {
        if (! hash_equals($this->payload_digest, $request->digest())) {
            throw StartRequestConflict::forRequest($request->requestId);
        }

        return $this;
    }

    // ----------[ Scopes ]----------

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
    protected function forOwnerReference(Builder $query, string $reference): void
    {
        $query->where('owner_reference', $reference);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function requestedBy(Builder $query, ActorIdentity $requester): void
    {
        $query->where('actor_type', $requester->type->value)->where('actor_id', $requester->id);
    }
}
