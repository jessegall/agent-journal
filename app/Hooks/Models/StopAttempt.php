<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One request of a session to stop, by its stop callback: the policy and workspace generation it was asked under and
 * the conditions it must pass, kept once per session and stop callback until the host's results settle it. A request
 * reads only its own session's attempts.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $stop_id
 * @property string $policy_digest
 * @property int $workspace_generation
 * @property array<string, string> $condition_hashes
 * @property StopAttemptState $state
 * @property string|null $submission_digest
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['stop_id', 'policy_digest', 'workspace_generation', 'condition_hashes', 'state', 'submission_digest'])]
final class StopAttempt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

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
        ];
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
        $now = Carbon::now();
        $query = self::query()->withoutGlobalScope(AgentSessionScope::class);
        $query->insertOrIgnore([
            'id' => (string) Str::ulid(),
            'agent_id' => $stop->agentId,
            'session_id' => $stop->sessionId,
            'stop_id' => $stop->hookId,
            'policy_digest' => $policyDigest,
            'workspace_generation' => $workspaceGeneration,
            'condition_hashes' => json_encode($conditionHashes, JSON_THROW_ON_ERROR),
            'state' => StopAttemptState::Pending->value,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->where('session_id', $stop->sessionId)
            ->where('stop_id', $stop->hookId)
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
            ->whereIn('session_id', $sessionIds)
            ->where('state', StopAttemptState::Pending->value)
            ->orderBy('created_at')
            ->readLimit(50)
            ->get()
            ->all());
    }

    /**
     * @return HasMany<StopResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(StopResult::class);
    }

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

    /**
     * Records that one submission of the host's results settled the attempt.
     */
    public function settle(StopAttemptState $state, string $submissionDigest): void
    {
        $this->state = $state;
        $this->submission_digest = $submissionDigest;
        $this->save();
    }
}
