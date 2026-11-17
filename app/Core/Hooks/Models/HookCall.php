<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Models\Support\AgentSessionScope;
use App\Core\Hooks\Storage\RecordedAnswer;
use App\Core\Hooks\Storage\RecordedAnswerCast;
use App\Core\Hooks\Storage\RecordedSteps;
use App\Core\Hooks\Storage\RecordedStepsCast;
use App\Core\Hooks\Support\StackTarget;
use App\Core\Links\Support\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Carbon;

/**
 * One answered hook call, kept so a retry of the same call gets the same answer. The agent and session are set only through recordFor.
 *
 * @property int $id
 * @property int $agent_id
 * @property int $session_id
 * @property string $event_id
 * @property string $input_digest
 * @property RecordedAnswer $answer
 * @property RecordedSteps $steps
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['event_id', 'input_digest', 'answer', 'steps'])]
final class HookCall extends Model
{
    use Linkable;

    public function recordFor(HookIdentity $hook, RecordedAnswer $answer, RecordedSteps $steps): void
    {
        $this->agent_id = $hook->agentId;
        $this->session_id = $hook->sessionId;
        $this->event_id = $hook->hookId;
        $this->input_digest = $hook->inputDigest;
        $this->answer = $answer;
        $this->steps = $steps;
        $this->save();
    }

    /**
     * Whether this recorded call is the same call as the identity: the same id with the same input.
     */
    public function isSameCallAs(HookIdentity $hook): bool
    {
        return $this->event_id === $hook->hookId && hash_equals($this->input_digest, $hook->inputDigest);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'agent_id' => 'integer',
            'session_id' => 'integer',
            'answer' => RecordedAnswerCast::class,
            'steps' => RecordedStepsCast::class,
        ];
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forHookId(Builder $query, string $hookId): void
    {
        $query->where('event_id', $hookId);
    }

    /**
     * The administrator's read of hook calls past their retention, across every agent; calls of a held stack are left out.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function prunableBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('created_at', '<', $cutoff)
            ->whereNotExists(fn (QueryBuilder $held) => $held->selectRaw('1')
                ->from('agent_stacks')
                ->whereColumn('agent_stacks.agent_id', 'hook_calls.agent_id')
                ->whereColumn('agent_stacks.session_id', 'hook_calls.session_id')
                ->whereNotNull('agent_stacks.held_at'));
    }

    /**
     * The explicit read of another agent or session's hook calls, for a caller the user authorized; it lifts the current-agent limit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function authorizedFor(Builder $query, StackTarget $target): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class)
            ->where('agent_id', $target->agentId)
            ->where('session_id', $target->sessionId);
    }
}
