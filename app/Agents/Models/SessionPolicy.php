<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\SessionPolicyFrozen;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\StoredPolicies;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * The policy one session was launched under, written once with the launch and never changed: a later profile
 * revision reaches only the next launch.
 *
 * @property string $id
 * @property string $session_id
 * @property string|null $profile_key
 * @property int|null $profile_revision
 * @property string|null $configuration_hash
 * @property array<string, mixed> $access_policy
 * @property array<string, mixed> $stop_conditions
 * @property array<string, mixed> $execution_policy
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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['access_policy' => 'array', 'stop_conditions' => 'array', 'execution_policy' => 'array'];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $policy) => throw SessionPolicyFrozen::forSession($policy->session_id));
    }

    /**
     * Freezes the launch's policy with the session it started.
     */
    public static function freeze(AgentSession $session, LaunchPolicy $policy): self
    {
        $frozen = new self();
        $frozen->session_id = $session->id;
        $frozen->profile_key = $policy->profileKey;
        $frozen->profile_revision = $policy->profileRevision;
        $frozen->configuration_hash = $policy->configurationHash;
        $frozen->access_policy = StoredPolicies::accessToArray($policy->access);
        $frozen->stop_conditions = StoredPolicies::stopConditionsToArray($policy->stopConditions);
        $frozen->execution_policy = StoredPolicies::executionToArray($policy->execution);
        $frozen->policy_digest = $policy->digest();
        $frozen->save();

        return $frozen;
    }

    public function policy(): LaunchPolicy
    {
        return new LaunchPolicy(
            StoredPolicies::accessFrom($this->access_policy),
            StoredPolicies::stopConditionsFrom($this->stop_conditions),
            StoredPolicies::executionFrom($this->execution_policy),
            $this->profile_key,
            $this->profile_revision,
            $this->configuration_hash,
        );
    }
}
