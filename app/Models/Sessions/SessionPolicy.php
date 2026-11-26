<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Agents\AgentSession;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Sessions\Exceptions\SessionPolicyFrozen;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use App\Values\AccessPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $session_id
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property string|null $configuration_hash
 * @property AccessPolicy $access_policy
 * @property StopConditions $stop_conditions
 * @property ExecutionPolicy $execution_policy
 * @property string $policy_digest
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $policy
 *
 * @mixin \Eloquent
 */
#[Table('session_policies')]
final class SessionPolicy extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'access_policy' => AccessPolicy::class,
            'stop_conditions' => StopConditions::class,
            'execution_policy' => ExecutionPolicy::class,
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $policy) => $policy->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * Freezes the start's policy with the session it started.
     */
    public static function create(AgentSession $session, StartPolicy $policy): self
    {
        $frozen = new self();
        $frozen->session_id = $session->id;
        $frozen->profile_key = $policy->profileKey;
        $frozen->profile_revision = $policy->profileRevision;
        $frozen->configuration_hash = $policy->configurationHash;
        $frozen->access_policy = $policy->access;
        $frozen->stop_conditions = $policy->stopConditions;
        $frozen->execution_policy = $policy->execution;
        $frozen->policy_digest = $policy->digest();
        $frozen->save();

        return $frozen;
    }

    /**
     * The label of each stop condition the session must pass, by condition key.
     *
     * @return array<string, string>
     */
    public function stopConditionLabels(): array
    {
        $labels = [];

        foreach ($this->stop_conditions->conditions as $condition) {
            $labels[$condition->key] = $condition->label;
        }

        return $labels;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<StartPolicy, never>
     */
    protected function policy(): Attribute
    {
        return Accessor::get(fn () => new StartPolicy(
            $this->access_policy,
            $this->stop_conditions,
            $this->execution_policy,
            $this->profile_key,
            $this->profile_revision,
            $this->configuration_hash,
        ));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a session's policy is fixed when the session starts.
     *
     * @throws SessionPolicyFrozen
     */
    private function assertUnedited(): never
    {
        throw SessionPolicyFrozen::forSession($this->session_id);
    }

    // ----------[ Queries ]----------

    /**
     * When each session's start must have ended: its start plus the wall budget frozen with it, by session id. A
     * session without a frozen policy has no budget and is not named.
     *
     * @param  list<AgentSession>  $sessions
     * @return array<string, CarbonImmutable>
     */
    public static function resolveWallDeadlinesOf(array $sessions): array
    {
        if ($sessions === []) {
            return [];
        }

        $starts = [];

        foreach ($sessions as $session) {
            $starts[$session->id] = CarbonImmutable::instance($session->created_at);
        }

        $policies = self::query()->ofSessions(array_keys($starts))->readExactly(count($starts))->get();
        $deadlines = [];

        foreach ($policies as $policy) {
            $wallSeconds = $policy->execution_policy->budgets->wallSeconds;
            $deadlines[$policy->session_id] = $starts[$policy->session_id]->addSeconds($wallSeconds);
        }

        return $deadlines;
    }

    // ----------[ Scopes ]----------

    /**
     * The policies of the sessions.
     *
     * @param  Builder<self>  $query
     * @param  list<array-key>  $ids
     */
    #[Scope]
    protected function ofSessions(Builder $query, array $ids): void
    {
        $query->whereIn('session_id', $ids);
    }

    /**
     * The rows of the given session.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->where('session_id', $sessionId);
    }
}
