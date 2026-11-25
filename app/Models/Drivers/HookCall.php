<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Hooks\HookCallRecorded;
use App\Models\Support\AgentSessionScope;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Storage\RecordedAnswer;
use App\Support\Storage\RecordedAnswerCast;
use App\Support\Storage\RecordedSteps;
use App\Support\Storage\RecordedStepsCast;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property string $event_id
 * @property string $input_digest
 * @property RecordedAnswer $answer
 * @property RecordedSteps $steps
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class HookCall extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'answer' => RecordedAnswerCast::class,
            'steps' => RecordedStepsCast::class,
        ];
    }

    // ----------[ Mutations ]----------

    public function recordFor(HookIdentity $hook, RecordedAnswer $answer, RecordedSteps $steps): void
    {
        $this->agent_id = $hook->agentId;
        $this->session_id = $hook->sessionId;
        $this->event_id = $hook->hookId;
        $this->input_digest = $hook->inputDigest;
        $this->answer = $answer;
        $this->steps = $steps;
        $this->assertSaved($this->save());
        $this->raise(new HookCallRecorded($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether this recorded call is the same call as the identity: the same id with the same input.
     */
    public function isSameCallAs(HookIdentity $hook): bool
    {
        return $this->event_id === $hook->hookId && hash_equals($this->input_digest, $hook->inputDigest);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forHookId(Builder $query, string $hookId): void
    {
        $query->where('event_id', $hookId);
    }

    /**
     * The administrator's read across every agent and session, which lifts the current-agent limit.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function acrossEveryAgent(Builder $query): void
    {
        $query->withoutGlobalScope(AgentSessionScope::class);
    }

    /**
     * The administrator's read of hook calls past their retention, across every agent; calls of a held stack are left
     * out.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function prunableBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->acrossEveryAgent()
            ->where('created_at', '<', $cutoff)
            ->whereNotExists(fn (QueryBuilder $held) => $held->selectRaw('1')
                ->from('agent_stacks')
                ->whereColumn('agent_stacks.agent_id', 'hook_calls.agent_id')
                ->whereColumn('agent_stacks.session_id', 'hook_calls.session_id')
                ->whereNotNull('agent_stacks.held_at'));
    }

    /**
     * The explicit read of another agent or session's hook calls, for a caller the user authorized; it lifts the
     * current-agent limit.
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
