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
])]
final class SessionPolicy extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'access_policy' => StoredAccessPolicy::class,
            'stop_conditions' => StoredStopConditions::class,
            'execution_policy' => StoredExecutionPolicy::class,
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $policy) => throw SessionPolicyFrozen::forSession($policy->session_id));
    }

    /**
     * Freezes the start's policy with the session it started.
     */
    public static function freeze(AgentSession $session, StartPolicy $policy): self
    {
        $frozen = new self();
        $frozen->session_id = $session->id;
        $frozen->profile_key = $policy->profileKey;
        $frozen->profile_revision = $policy->profileRevision;
        $frozen->configuration_hash = $policy->configurationHash;
        $frozen->access_policy = StoredAccessPolicy::fromAccessPolicy($policy->access);
        $frozen->stop_conditions = StoredStopConditions::fromStopConditions($policy->stopConditions);
        $frozen->execution_policy = StoredExecutionPolicy::fromExecutionPolicy($policy->execution);
        $frozen->policy_digest = $policy->digest();
        $frozen->save();

        return $frozen;
    }

    public function policy(): StartPolicy
    {
        return new StartPolicy(
            $this->access_policy->toAccessPolicy(),
            $this->stop_conditions->toStopConditions(),
            $this->execution_policy->toExecutionPolicy(),
            $this->profile_key,
            $this->profile_revision,
            $this->configuration_hash,
        );
    }
}
