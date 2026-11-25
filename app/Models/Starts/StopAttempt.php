<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\StopAttemptState;
use App\Events\Sessions\StopAttemptCertified;
use App\Events\Sessions\StopAttemptSettled;
use App\Models\Agents\AgentSession;
use App\Models\Support\Accessor;
use App\Models\Support\AgentSessionScope;
use App\Support\ActorIdentity;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\RelationRead;
use App\Values\StopAttemptReference;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $stop_id
 * @property string $policy_digest
 * @property int $workspace_generation
 * @property array $condition_hashes
 * @property StopAttemptState $state
 * @property ?string $submission_digest
 * @property ?Carbon $certified_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $reference attribute
 * @property Collection<int, StopResult>|StopResult[] $results
 */
final class StopAttempt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * The workspace generation every attempt is asked under until the host counts the changes it admits.
     */
    public const int FIRST_GENERATION = 0;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'workspace_generation' => 'integer',
            'condition_hashes' => 'array',
            'state' => StopAttemptState::class,
            'certified_at' => 'datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Records that one submission of the host's results settled the attempt, with what its refusing conditions said.
     */
    public function settle(StopAttemptState $state, string $submissionDigest, string $failureSummary): void
    {
        $this->state = $state;
        $this->submission_digest = $submissionDigest;
        $this->assertSaved($this->save());
        $this->raise(new StopAttemptSettled($this->id, $state, $this->outcomeOf($failureSummary)));
    }

    /**
     * Marks this passed attempt as the certificate of the session's completion.
     */
    public function certify(): void
    {
        $this->certified_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new StopAttemptCertified($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether results run under this policy digest and workspace generation belong to this attempt.
     */
    public function isFor(string $policyDigest, int $workspaceGeneration): bool
    {
        return hash_equals($this->policy_digest, $policyDigest)
            && $this->workspace_generation === $workspaceGeneration;
    }

    /**
     * Whether the reported definitions are exactly the conditions this attempt asked for.
     *
     * @param  array<string, string>  $definitionHashes  condition key => hash of the definition the host ran
     */
    public function asksFor(array $definitionHashes): bool
    {
        $asked = $this->condition_hashes;
        ksort($asked);
        ksort($definitionHashes);

        return $asked === $definitionHashes;
    }

    public function isSettled(): bool
    {
        return $this->state !== StopAttemptState::Pending;
    }

    public function wasSubmittedAs(string $submissionDigest): bool
    {
        return $this->submission_digest !== null && hash_equals($this->submission_digest, $submissionDigest);
    }

    public function isCertified(): bool
    {
        return $this->certified_at !== null;
    }

    // ----------[ Calculations ]----------

    /**
     * The attempt's outcome: the same for two attempts that settled alike, with the same failures under the same
     * policy and workspace generation.
     */
    public function outcomeOf(string $failureSummary): string
    {
        return hash('sha256', implode("\n", [
            $this->state->value,
            $this->policy_digest,
            (string) $this->workspace_generation,
            $failureSummary,
        ]));
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<StopAttemptReference, never>
     */
    protected function reference(): Attribute
    {
        return Accessor::get(fn () => new StopAttemptReference($this->id));
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<StopResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(StopResult::class);
    }

    // ----------[ Queries ]----------

    /**
     * The agent whose session made the attempt, as the actor that asks for help when its stop is held.
     */
    public static function agentOf(StopAttemptReference $attempt): ActorIdentity
    {
        $sessionId = self::query()->withoutGlobalScope(AgentSessionScope::class)->findOrFail($attempt->attemptId)
            ->session_id;

        return new ActorIdentity(ActorType::Agent, AgentSession::byId($sessionId)->agent_id);
    }

    /**
     * The pending attempt of this stop callback, opened once: a retried callback finds the attempt it opened.
     *
     * @param  array<string, string>  $conditionHashes  condition key => hash of its definition
     */
    public static function openFor(
        HookIdentity $stop,
        string $policyDigest,
        int $workspaceGeneration,
        array $conditionHashes,
    ): self {
        $attempt = new self();
        $attempt->setAttribute($attempt->getKeyName(), $attempt->newUniqueId());
        $attempt->agent_id = $stop->agentId;
        $attempt->session_id = $stop->sessionId;
        $attempt->stop_id = $stop->hookId;
        $attempt->policy_digest = $policyDigest;
        $attempt->workspace_generation = $workspaceGeneration;
        $attempt->condition_hashes = $conditionHashes;
        $attempt->state = StopAttemptState::Pending;

        $attempt->insertIfAbsent();

        return self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->ofStop($stop)
            ->sole();
    }

    /**
     * The attempts of these sessions still waiting for the host's results, oldest first.
     *
     * @param  list<string>  $sessionIds
     * @return list<self>
     */
    public static function pendingOf(array $sessionIds): array
    {
        return array_values(self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->ofSessions($sessionIds)
            ->inState(StopAttemptState::Pending)
            ->oldestFirst()
            ->limit(50)
            ->get()
            ->all());
    }

    /**
     * Attempts whose final checks passed and whose work is not yet certified, oldest first: their stop was answered
     * before the host reported, or never came back.
     *
     * @return list<self>
     */
    public static function passedUncertified(int $limit): array
    {
        return array_values(self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->inState(StopAttemptState::Passed)
            ->uncertified()
            ->oldestFirst()
            ->readExactly($limit)
            ->get()
            ->all());
    }

    /**
     * The settled attempts of this session, newest first, at most this many.
     *
     * @return list<self>
     */
    public static function latestSettledOf(string $sessionId, int $count): array
    {
        return array_values(self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->ofSessions([$sessionId])
            ->settled()
            ->newestFirst()
            ->readExactly($count)
            ->get()
            ->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The attempt of the stop hook.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofStop(Builder $query, HookIdentity $stop): void
    {
        $query->where('session_id', $stop->sessionId)->where('stop_id', $stop->hookId);
    }

    /**
     * The attempts of the sessions.
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
     * The attempts in that state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, StopAttemptState $state): void
    {
        $query->where('state', $state->value);
    }

    /**
     * The attempts no longer pending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function settled(Builder $query): void
    {
        $query->where('state', '!=', StopAttemptState::Pending->value);
    }

    /**
     * The attempts not certified yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function uncertified(Builder $query): void
    {
        $query->whereNull('certified_at');
    }

    /**
     * The attempts of every session, not only the current one: a host reports results for any.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function acrossSessions(Builder $query): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class);
    }

    /**
     * The attempts with their results loaded, at most fifty of each, which is all a host reports.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withResults(Builder $query): void
    {
        $query->with(['results' => RelationRead::complete(max: 50)->constraint()]);
    }
}
