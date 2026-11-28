<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\AgentStartChoiceMade;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Values\ChosenAccount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The driver, model and account an agent's next start runs on, chosen for a new agent or
 * a switch asked of a stopped agent. The message that starts the agent starts it on this choice.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $driver
 * @property string $model
 * @property string|null $account_id
 * @property int|null $account_revision
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Agent $agent
 *
 * @mixin \Eloquent
 */
final class AgentStartChoice extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /** Makes a row for the agent's first selected start. */
    public static function create(string $agentId, string $driver, string $model, ChosenAccount|null $account): self
    {
        $choice = new self();
        $choice->agent_id = $agentId;
        $choice->choose($driver, $model, $account);

        return $choice;
    }

    // ----------[ Mutations ]----------

    /** Replaces the driver, model and account of the agent's next start. */
    public function choose(string $driver, string $model, ChosenAccount|null $account): void
    {
        $this->driver = $driver;
        $this->model = $model;
        $this->account_id = $account?->accountId;
        $this->account_revision = $account?->reviewedSignIn;
        $this->saveAndAssert();
        $this->raise(new AgentStartChoiceMade($this->agent_id));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    // ----------[ Queries ]----------

    /**
     * The choice the agent's next start runs on; none while nothing was chosen.
     */
    public static function findFor(string $agentId): self|null
    {
        return self::query()->ofAgent($agentId)->first();
    }

    /**
     * The account chosen with it and the sign-in revision seen then; none for the driver's default account.
     */
    public function chosenAccount(): ChosenAccount|null
    {
        if ($this->account_id === null || $this->account_revision === null) {
            return null;
        }

        return new ChosenAccount($this->account_id, $this->account_revision);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }
}
