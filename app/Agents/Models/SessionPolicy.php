<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\SessionPolicyFrozen;
use App\Agents\Stored\StoredAccessPolicy;
use App\Agents\Stored\StoredExecutionPolicy;
use App\Agents\Stored\StoredStopConditions;
use App\Agents\Support\StartPolicy;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * The policy one session was started under, written once with the start and never changed: a later profile
 * revision reaches only the next start.
 *
 * @property string $id
 * @property string $session_id
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property string|null $configuration_hash
 * @property StoredAccessPolicy $access_policy
 * @property StoredStopConditions $stop_conditions
 * @property StoredExecutionPolicy $execution_policy
 * @property string $policy_digest
 * @property bool $requires_review
 */
#[Table('session_policies')]
#[Fillable([
    'session_id',
    'profile_key',
    'profile_revision',
    'configuration_hash',
    'access_policy',
    'stop_conditions',
    'execution_policy',
    'policy_digest',
    'requires_review',
])]
final class SessionPolicy extends Model implements ReadableModel
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
            'access_policy' => StoredAccessPolicy::class,
            'stop_conditions' => StoredStopConditions::class,
            'execution_policy' => StoredExecutionPolicy::class,
            'requires_review' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $policy) => throw SessionPolicyFrozen::forSession($policy->session_id));
    }

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
        $frozen->requires_review = $policy->requiresReview;
        $frozen->access_policy = StoredAccessPolicy::fromAccessPolicy($policy->access);
        $frozen->stop_conditions = StoredStopConditions::fromStopConditions($policy->stopConditions);
        $frozen->execution_policy = StoredExecutionPolicy::fromExecutionPolicy($policy->execution);
        $frozen->policy_digest = $policy->digest();
        $frozen->save();

        return $frozen;
    }

    // ----------[ Queries ]----------

    /**
     * When each session's launch must have ended: its start plus the wall budget frozen with it, by session id. A
     * session without a frozen policy has no budget and is not named.
     *
     * @param  list<AgentSession>  $sessions
     * @return array<string, CarbonImmutable>
     */
    public static function wallDeadlinesOf(array $sessions): array
    {
        if ($sessions === []) {
            return [];
        }

        $starts = [];

        foreach ($sessions as $session) {
            $starts[$session->id] = CarbonImmutable::instance($session->created_at);
        }

        $policies = self::query()->whereIn('session_id', array_keys($starts))->readLimit(count($starts))->get();
        $deadlines = [];

        foreach ($policies as $policy) {
            $wallSeconds = $policy->execution_policy->budgets->wallSeconds;
            $deadlines[$policy->session_id] = $starts[$policy->session_id]->addSeconds($wallSeconds);
        }

        return $deadlines;
    }

    // ----------[ Answers ]----------

    public function policy(): StartPolicy
    {
        return new StartPolicy(
            $this->access_policy->toAccessPolicy(),
            $this->stop_conditions->toStopConditions(),
            $this->execution_policy->toExecutionPolicy(),
            $this->profile_key,
            $this->profile_revision,
            $this->configuration_hash,
            $this->requires_review,
        );
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
}
