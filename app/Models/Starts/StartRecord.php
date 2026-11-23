<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Refusals\StartRefusal;
use App\Enums\ActorType;
use App\Enums\ConversationModeType;
use App\Enums\DriverSourceType;
use App\Enums\DriverVariant;
use App\Enums\HostRefusal;
use App\Enums\ModelSelectionType;
use App\Enums\ResumeRefusal;
use App\Enums\StartDisposition;
use App\Enums\StartOriginType;
use App\Enums\StartPreflightRefusal;
use App\Enums\StartReadiness;
use App\Enums\StartRefusalType;
use App\Enums\StartUnavailableReason;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRequestConflict;
use App\Models\Agents\AgentSession;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\PinnedDriver;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
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
 * @property string $driver_key
 * @property string $family
 * @property string $driver_label
 * @property int|null $catalogue_revision
 * @property string $model
 * @property ModelSelectionType $requested_model_type
 * @property string|null $requested_model
 * @property DriverSourceType $driver_source
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property StartOriginType $origin_type
 * @property string|null $owner_reference
 * @property string|null $context_reference
 * @property ConversationModeType $conversation_mode
 * @property string|null $conversation_target
 * @property DriverVariant $mode
 * @property bool $account_chosen
 * @property bool $remember
 * @property bool|null $conversation_resumed
 * @property string $payload_digest
 * @property StartDisposition $disposition
 * @property StartReadiness $readiness
 * @property string|null $native_id
 * @property string|null $refusal_reason
 * @property CarbonImmutable|null $refused_at
 * @property string|null $session_id
 * @property string|null $reply_inbox_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'request_id',
    'agent_id',
    'actor_type',
    'actor_id',
    'driver_key',
    'family',
    'driver_label',
    'catalogue_revision',
    'model',
    'requested_model_type',
    'requested_model',
    'driver_source',
    'profile_key',
    'profile_revision',
    'origin_type',
    'owner_reference',
    'context_reference',
    'conversation_mode',
    'conversation_target',
    'mode',
    'account_chosen',
    'remember',
    'conversation_resumed',
    'payload_digest',
    'disposition',
    'readiness',
    'native_id',
    'session_id',
    'reply_inbox_id',
])]
final class StartRecord extends Model implements ReadableModel
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
        return [
            'requested_model_type' => ModelSelectionType::class,
            'driver_source' => DriverSourceType::class,
            'profile_revision' => 'integer',
            'origin_type' => StartOriginType::class,
            'conversation_mode' => ConversationModeType::class,
            'conversation_resumed' => 'boolean',
            'mode' => DriverVariant::class,
            'account_chosen' => 'boolean',
            'remember' => 'boolean',
            'disposition' => StartDisposition::class,
            'readiness' => StartReadiness::class,
            'refused_at' => 'datetime',
        ];
    }

    /**
     * The record of this request: the one already kept under its id when the contents match, else a new accepted one
     * that answers to the requester's reply inbox, fixed from then on. A request refused before is refused again.
     *
     * @param  Option<string>  $replyInboxId
     *
     * @throws StartRequestConflict
     * @throws StartRefusalReplayed
     */
    public static function accept(
        StartRequest $request,
        PinnedDriver $pin,
        ActorIdentity $requester,
        Option $replyInboxId,
    ): self {
        $existing = self::query()->where('request_id', $request->requestId)->lockForUpdate()->first();

        if ($existing !== null) {
            $existing->assertDigest($request);
            $existing->assertNotRefused();

            return $existing;
        }

        $selection = $request->selection;
        $requested = $selection->requested;
        $source = $selection->source;

        return self::query()->create([
            'request_id' => $request->requestId,
            'agent_id' => $request->agentId,
            'actor_type' => $requester->type->value,
            'actor_id' => $requester->id,
            'driver_key' => (string) $pin->registration->key,
            'family' => $pin->registration->family,
            'driver_label' => $pin->registration->label,
            'catalogue_revision' => $pin->catalogueRevision,
            'model' => $selection->model,
            'requested_model_type' => $requested->type,
            'requested_model' => $requested->model,
            'driver_source' => $source->driverSource,
            'profile_key' => $source->profileKey,
            'profile_revision' => $source->profileRevision,
            'origin_type' => $request->origin,
            'owner_reference' => $request->ownerReference,
            'context_reference' => $request->contextReference,
            'conversation_mode' => $request->conversationMode,
            'conversation_target' => $request->conversationTarget,
            'mode' => $request->variant,
            'account_chosen' => $request->chosenAccount !== null,
            'remember' => $request->savesVariant,
            'payload_digest' => $request->digest(),
            'disposition' => StartDisposition::Accepted,
            'readiness' => StartReadiness::Accepted,
            'reply_inbox_id' => $replyInboxId->getOrElse(null),
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * Each of these agents' latest start request, by agent, ended or not; an agent never started is not in it. An
     * older start never stands in for a newer one, so it is read in one query, one latest record for each.
     *
     * @param  list<string>  $agentIds
     * @return Collection<string, self>
     */
    public static function latestOf(array $agentIds): Collection
    {
        return self::query()
            ->whereIn('agent_id', $agentIds)
            ->whereNotExists(fn (QueryBuilder $newer) => $newer->from('start_records', 'newer')
                ->whereColumn('newer.agent_id', 'start_records.agent_id')
                ->where(fn (QueryBuilder $later) => $later
                    ->whereColumn('newer.created_at', '>', 'start_records.created_at')
                    ->orWhere(fn (QueryBuilder $sameTime) => $sameTime
                        ->whereColumn('newer.created_at', 'start_records.created_at')
                        ->whereColumn('newer.id', '>', 'start_records.id'))))
            ->readExactly(count($agentIds))
            ->get()
            ->keyBy('agent_id');
    }

    /**
     * The variant the start of this session asked to keep for its agent once it runs, none when it asked nothing.
     */
    public static function savedVariantOf(string $sessionId): DriverVariant|null
    {
        $record = self::query()->where('session_id', $sessionId)->where('remember', true)->first();

        return $record?->mode;
    }

    /**
     * The sessions among these whose latest start's driver has not proved its conversation yet, so their messages wait.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function sessionsHoldingDeliveries(array $ids): array
    {
        return array_keys(array_filter(
            self::latestReadinessOf($ids),
            fn (StartReadiness $readiness) => $readiness->shouldHoldDeliveries(),
        ));
    }

    /**
     * The readiness of each session's latest start, by session id; a session that began from no start record has none.
     *
     * @param  list<string>  $ids
     * @return array<string, StartReadiness>
     */
    public static function latestReadinessOf(array $ids): array
    {
        return self::query()
            ->whereIn('session_id', $ids)
            ->orderBy('created_at')
            ->orderBy('id')
            ->readAll('the start records of the sessions whose readiness is read together')
            ->get()
            ->keyBy('session_id')
            ->map(fn (self $record) => $record->readiness)
            ->all();
    }

    /**
     * The accepted starts of these sessions, locked, whose bootstrap a claim is taking.
     *
     * @param  list<string>  $ids
     * @return Collection<int, self>
     */
    public static function lockedAcceptedOf(array $ids): Collection
    {
        return self::query()
            ->whereIn('session_id', $ids)
            ->where('readiness', StartReadiness::Accepted)
            ->lockForUpdate()
            ->readAll('the accepted starts of the sessions whose bootstrap one claim took')
            ->get();
    }

    /**
     * The latest start of the session, locked, when it began from a start record.
     *
     * @return Option<self>
     */
    public static function lockedLatestOf(string $sessionId): Option
    {
        return Option::fromValue(self::query()
            ->where('session_id', $sessionId)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->lockForUpdate()
            ->first());
    }

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
     * Whether the owner chose the conversation this session resumes, so the host may not start fresh in its place.
     */
    public static function requiresConversation(string $sessionId): bool
    {
        return self::query()
            ->where('session_id', $sessionId)
            ->where('origin_type', StartOriginType::MainStart->value)
            ->whereNotNull('conversation_target')
            ->exists();
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

    /**
     * The host took the start's bootstrap: its driver is proving which conversation it runs.
     */
    public function prepareIdentity(): void
    {
        $this->readiness = StartReadiness::PreparingIdentity;
        $this->save();
    }

    /**
     * The driver proved the conversation it runs, so the messages held for it go out; one already bound to another
     * conversation answers false and stays held.
     */
    public function bindIdentity(string $nativeId): bool
    {
        if ($this->native_id !== null && $this->native_id !== $nativeId) {
            return false;
        }

        $this->native_id = $nativeId;
        $this->readiness = StartReadiness::Ready;
        $this->save();

        return true;
    }

    /**
     * The bootstrap's end was not seen, so whether the driver runs the right conversation is unknown and its messages
     * stay held until a later report proves it.
     */
    public function markIdentityUncertain(): void
    {
        $this->readiness = StartReadiness::Uncertain;
        $this->save();
    }

    /**
     * Check status found no proof of the start's conversation, so a start still unverified is uncertain and its
     * messages stay held; a start that was proved, refused or cancelled meanwhile keeps its state.
     */
    public function markReadinessUnseen(): void
    {
        if (! $this->readiness->isUnverified()) {
            return;
        }

        $this->markIdentityUncertain();
    }

    /**
     * The owner cancelled the start while its session was not yet verified: no later report makes it ready.
     */
    public function cancelVerification(): void
    {
        if (! $this->readiness->takesReadiness() || $this->readiness === StartReadiness::Ready) {
            return;
        }

        $this->readiness = StartReadiness::Cancelled;
        $this->save();
    }

    public function startedAs(AgentSession $session): void
    {
        $this->session_id = $session->id;
        $this->disposition = StartDisposition::Started;
        $this->save();
    }

    /**
     * The start was refused: the record keeps the reason and the time as its receipt, and names no session.
     */
    public function refuse(StartRefusal $refusal): void
    {
        $this->refuseFor($refusal->reason());
    }

    /**
     * The start was refused for this reason after it was accepted, such as by the host that could not wake it: the
     * record keeps the reason as its receipt, and its session stays named.
     */
    public function refuseFor(
        StartRefusalType|StartPreflightRefusal|ResumeRefusal|StartUnavailableReason|HostRefusal $reason,
    ): void {
        $this->disposition = StartDisposition::Refused;
        $this->readiness = StartReadiness::Refused;
        $this->refusal_reason = $reason->value;
        $this->refused_at = CarbonImmutable::now();
        $this->save();
    }

    /**
     * An intent whose start failed for a reason that is no refusal, and that started nothing, leaves its key free.
     */
    public function forgetIntent(): void
    {
        if ($this->disposition !== StartDisposition::Accepted || $this->session_id !== null) {
            return;
        }

        $this->delete();
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

    public function wasRequestedBy(ActorIdentity $actor): bool
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id)->isSameAs($actor);
    }

    // ----------[ Internals ]----------

    /**
     * @throws StartRequestConflict
     */
    private function assertDigest(StartRequest $request): void
    {
        if (! hash_equals($this->payload_digest, $request->digest())) {
            throw StartRequestConflict::forRequest($request->requestId);
        }
    }

    /**
     * @throws StartRefusalReplayed
     */
    private function assertNotRefused(): void
    {
        if ($this->disposition !== StartDisposition::Refused) {
            return;
        }

        throw StartRefusalReplayed::forRequest($this->request_id, (string) $this->refusal_reason);
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
