<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Models;

use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Storage\RecordedAnswer;
use App\Domain\Hooks\Storage\RecordedAnswerCast;
use App\Domain\Hooks\Storage\RecordedSteps;
use App\Domain\Hooks\Storage\RecordedStepsCast;
use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Links\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
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
