<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Refusals\StartRefusal;
use App\Enums\ActorType;
use App\Enums\ConversationModeType;
use App\Enums\DriverSourceType;
use App\Enums\DriverType;
use App\Enums\HostRefusal;
use App\Enums\ModelSelectionType;
use App\Enums\ResumeRefusal;
use App\Enums\StartDisposition;
use App\Enums\StartOriginType;
use App\Enums\StartPreflightRefusal;
use App\Enums\StartReadiness;
use App\Enums\StartRefusalType;
use App\Enums\StartUnavailableReason;
use App\Events\Sessions\StartIdentityBecameUncertain;
use App\Events\Sessions\StartIdentityBound;
use App\Events\Sessions\StartIdentityPrepared;
use App\Events\Sessions\StartIntentForgotten;
use App\Events\Sessions\StartRecordRefused;
use App\Events\Sessions\StartSessionOpened;
use App\Events\Sessions\StartVerificationCancelled;
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
 * @property DriverType $driver_type
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
    'driver_type',
    'account_chosen',
    'remember',
    'conversation_resumed',
    'payload_digest',
    'disposition',
    'readiness',
    'native_id',
    'session_id',
])]
final class StartRecord extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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
            'driver_type' => DriverType::class,
            'account_chosen' => 'boolean',
            'remember' => 'boolean',
            'disposition' => StartDisposition::class,
            'readiness' => StartReadiness::class,
            'refused_at' => 'datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The record of this request: the one already kept under its id when the contents match, else a new accepted one
     * that answers to the requester's reply inbox, fixed from then on. A request refused before is refused again.
     *
     *
     * @throws StartRequestConflict
     * @throws StartRefusalReplayed
     */
    public static function create(
        StartRequest $request,
        PinnedDriver $pin,
        ActorIdentity $requester,
    ): self {
        $existing = self::query()->underRequest($request->requestId)->lockForUpdate()->first();

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
            'owner_reference' => $request->ownerWork?->reference(),
            'context_reference' => $request->contextReference,
            'conversation_mode' => $request->conversationMode,
            'conversation_target' => $request->conversationTarget,
            'driver_type' => $request->driverType,
            'account_chosen' => $request->chosenAccount !== null,
            'remember' => $request->savesDriverType,
            'payload_digest' => $request->digest(),
            'disposition' => StartDisposition::Accepted,
            'readiness' => StartReadiness::Accepted,
        ]);
    }

    // ----------[ Mutations ]----------

    /**
     * The host took the start's bootstrap: its driver is proving which conversation it runs.
     */
    public function prepareIdentity(): void
    {
        $this->readiness = StartReadiness::PreparingIdentity;
        $this->assertSaved($this->save());
        $this->raise(new StartIdentityPrepared($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new StartIdentityBound($this->id, $nativeId));

        return true;
    }

    /**
     * The bootstrap's end was not seen, so whether the driver runs the right conversation is unknown and its messages
     * stay held until a later report proves it.
     */
    public function markIdentityUncertain(): void
    {
        $this->readiness = StartReadiness::Uncertain;
        $this->assertSaved($this->save());
        $this->raise(new StartIdentityBecameUncertain($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new StartVerificationCancelled($this->id));
    }

    public function startedAs(AgentSession $session): void
    {
        $this->session_id = $session->id;
        $this->disposition = StartDisposition::Started;
        $this->assertSaved($this->save());
        $ownerWork = $this->owner_reference === null ? null : $this->ownerWork();
        $this->raise(new StartSessionOpened($this->id, $this->agent_id, $session->id, $ownerWork));
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
        $this->assertSaved($this->save());
        $this->raise(new StartRecordRefused($this->id, $reason->value));
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
        $this->raise(new StartIntentForgotten($this->id));
    }

    // ----------[ Predicates ]----------

    public function wasRequestedBy(ActorIdentity $actor): bool
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id)->isSameAs($actor);
    }

    // ----------[ Transformers ]----------

    /**
     * The work this start was made for, as its owner names it.
     */
    public function ownerWork(): RecordIdentity
    {
        [$type, $id] = explode(':', (string) $this->owner_reference, 2);

        return new RecordIdentity($type, $id);
    }

    // ----------[ Asserts ]----------

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
            ->ofAgents($agentIds)
            ->newestOfItsAgent()
            ->readExactly(count($agentIds))
            ->get()
            ->keyBy('agent_id');
    }

    /**
     * The driver type the start of this session asked to keep for its agent once it runs, none when it asked nothing.
     */
    public static function savedDriverTypeOf(string $sessionId): DriverType|null
    {
        $record = self::query()->ofSessions([$sessionId])->remembered()->first();

        return $record?->driver_type;
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
            ->ofSessions($ids)
            ->oldestFirst()
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
            ->ofSessions($ids)
            ->inReadiness(StartReadiness::Accepted)
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
        $record = self::query()->ofSessions([$sessionId])->newestFirst()->lockForUpdate()->first();

        return Option::fromValue($record);
    }

    /**
     * The start an owner made for this session, when the session began from an owner's request.
     *
     * @return Option<self>
     */
    public static function ownerStartOf(string $sessionId): Option
    {
        $record = self::query()->ofSessions([$sessionId])->ofOrigin(StartOriginType::OwnerRequest)->withOwner()
            ->first();

        return Option::fromValue($record);
    }

    /**
     * The native conversation the session's start chose to continue, if it chose one.
     */
    public static function conversationTargetOf(string $sessionId): string|null
    {
        return self::query()->ofSessions([$sessionId])->value('conversation_target');
    }

    /**
     * Whether the owner chose the conversation this session resumes, so the host may not start fresh in its place.
     */
    public static function requiresConversation(string $sessionId): bool
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->ofOrigin(StartOriginType::MainStart)
            ->withConversationTarget()
            ->exists();
    }

    /**
     * Whether the session was started to resume an earlier conversation of the same agent.
     */
    public static function resumesConversation(string $sessionId): bool
    {
        return self::query()
            ->ofSessions([$sessionId])
            ->inConversationMode(ConversationModeType::Resume)
            ->exists();
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

    /**
     * The start records that name their owner.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withOwner(Builder $query): void
    {
        $query->whereNotNull('owner_reference');
    }

    /**
     * The record of the start request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underRequest(Builder $query, string $requestId): void
    {
        $query->where('request_id', $requestId);
    }

    /**
     * The records of the agents.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $agentIds
     */
    #[Scope]
    protected function ofAgents(Builder $query, array $agentIds): void
    {
        $query->whereIn('agent_id', $agentIds);
    }

    /**
     * The records of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $sessionIds
     */
    #[Scope]
    protected function ofSessions(Builder $query, array $sessionIds): void
    {
        $query->whereIn('session_id', $sessionIds);
    }

    /**
     * The records no newer record of the same agent follows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestOfItsAgent(Builder $query): void
    {
        $query->whereNotExists(fn (QueryBuilder $newer) => $newer->from('start_records', 'newer')
            ->whereColumn('newer.agent_id', 'start_records.agent_id')
            ->where(fn (QueryBuilder $later) => $later
                ->whereColumn('newer.created_at', '>', 'start_records.created_at')
                ->orWhere(fn (QueryBuilder $sameTime) => $sameTime
                    ->whereColumn('newer.created_at', 'start_records.created_at')
                    ->whereColumn('newer.id', '>', 'start_records.id'))));
    }

    /**
     * The records whose driver type is saved for later starts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function remembered(Builder $query): void
    {
        $query->where('remember', true);
    }

    /**
     * The records in that readiness.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inReadiness(Builder $query, StartReadiness $readiness): void
    {
        $query->where('readiness', $readiness);
    }

    /**
     * The records of that origin.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofOrigin(Builder $query, StartOriginType $origin): void
    {
        $query->where('origin_type', $origin->value);
    }

    /**
     * The records that name a conversation to join.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withConversationTarget(Builder $query): void
    {
        $query->whereNotNull('conversation_target');
    }

    /**
     * The records of that conversation mode.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inConversationMode(Builder $query, ConversationModeType $mode): void
    {
        $query->where('conversation_mode', $mode->value);
    }
}
