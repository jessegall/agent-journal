<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Actors\Contracts\RecipientActor;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Values\RunningRuntime;
use App\Asks\Contracts\QuestionRecipient;
use App\Assignments\Contracts\Assignee;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersByCreation;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Concerns\TakesPartInMessages;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\AgentDriverTypePreferred;
use App\Events\Sessions\AgentRetired;
use App\Events\Sessions\AgentRuntimeAdopted;
use App\Exceptions\ModelMissing;
use App\Messages\Contracts\MessageReceiver;
use App\Messages\Contracts\MessageSender;
use App\Models\Inboxes\InboxMember;
use App\Models\Projects\Project;
use App\Models\Support\HasProjectColumn;
use App\Models\Support\JournalModel;
use App\Models\Support\ProjectScope;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Values\ProjectSelection;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Override;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $name
 * @property string $project_id
 * @property string $profile_key
 * @property CarbonImmutable|null $retired_at
 * @property string|null $current_session_id
 * @property int $runtime_generation
 * @property DriverType|null $driver_type_preference
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, InboxMember> $inboxMemberships
 * @property-read int|null $inbox_memberships_count
 *
 * @mixin \Eloquent
 */
final class Agent extends JournalModel implements
    Assignee,
    EventSource,
    MessageReceiver,
    MessageSender,
    ProjectOwned,
    QuestionRecipient,
    ReadableModel,
    RecipientActor
{
    use BoundedReads;
    use HasProjectColumn;
    use Linkable;
    use OrdersByCreation;
    use OrdersById;
    use RaisesEvents;
    use TakesPartInMessages;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'retired_at' => 'datetime',
            'driver_type_preference' => DriverType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new agent of the project that starts with the profile of this key unless a start names another; its project
     * never changes.
     */
    public static function create(string $name, string $profileKey, Project $project): self
    {
        $agent = new self();
        $agent->name = $name;
        $agent->project_id = $project->id;
        $agent->profile_key = $profileKey;
        $agent->saveAndAssert();

        return $agent;
    }

    // ----------[ Mutations ]----------

    /**
     * The driver type this agent's starts use from now on when they name none, kept once a start that asked to save it
     * runs.
     */
    public function preferDriverType(DriverType $driverType): void
    {
        $this->driver_type_preference = $driverType;
        $this->saveAndAssert();
        $this->raise(new AgentDriverTypePreferred($this->id, $driverType));
    }

    /**
     * Makes the session the agent's current runtime under a new generation; every earlier runtime is fenced.
     */
    public function adoptRuntime(AgentSession $session): void
    {
        $this->runtime_generation++;
        $this->current_session_id = $session->id;
        $this->saveAndAssert();
        $this->raise(new AgentRuntimeAdopted($this->id, $session->id, $this->runtime_generation));
    }

    /**
     * The agent is retired for good at the time given; it never starts again.
     */
    public function retireAt(CarbonInterface $retiredAt): void
    {
        $this->retired_at = CarbonImmutable::instance($retiredAt);
        $this->saveAndAssert();
        $this->raise(new AgentRetired($this->id));
    }

    // ----------[ Predicates ]----------

    public function isCurrentRuntime(AgentSession $session): bool
    {
        return $this->current_session_id === $session->id;
    }

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    // ----------[ Transformers ]----------

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    /**
     * The runtime of the current session, when that session runs under a driver that can be woken.
     *
     * @return Option<RunningRuntime>
     */
    public function currentRuntime(): Option
    {
        if ($this->current_session_id === null || ! AgentRuntime::canActForSession($this->current_session_id)) {
            return None::create();
        }

        $target = new StackTarget($this->id, $this->current_session_id);

        return Some::create(new RunningRuntime($target, $this->runtime_generation));
    }

    // ----------[ Answers ]----------

    public function actorType(): string
    {
        return self::storedType();
    }

    public function actorId(): string
    {
        return $this->id;
    }

    // ----------[ Queries ]----------

    #[Override]
    public static function storedType(): string
    {
        return 'agent';
    }

    /**
     * The agent with this id, if there is one.
     *
     * @return Option<self>
     */
    public static function findWithId(string $id): Option
    {
        return self::query()->whereKey($id)->firstOption();
    }

    /**
     * The id of the project the agent belongs to.
     *
     * @throws ModelMissing when there is no such agent
     */
    public static function resolveProjectIdOf(string $agentId): string
    {
        return self::query()
            ->whereKey($agentId)
            ->firstOr(ModelMissing::throwing()->for(self::class, $agentId))
            ->project_id;
    }

    /**
     * @return Option<ActorReference>
     */
    public static function resolveSoleActorForProfile(string $profile): Option
    {
        $matches = self::query()
            ->ofProfile($profile)
            ->unretired()
            ->limit(2)
            ->get();

        if ($matches->count() !== 1) {
            return None::create();
        }

        return Some::create(ActorReference::of($matches->sole()));
    }

    /**
     * These agents by id, in one query, for trusted Core work over many sessions.
     *
     * @param  list<string>  $ids
     * @return array<string, self>
     */
    public static function findByIds(array $ids): array
    {
        $agents = self::query()->whereKey($ids)->get();

        return $agents->keyBy('id')->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The agents that run under the profile.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, string $profile): void
    {
        $query->where('profile_key', $profile);
    }

    /**
     * The agents not retired.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unretired(Builder $query): void
    {
        $query->whereNull('retired_at');
    }

    /**
     * The rows by name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byName(Builder $query): void
    {
        $query->orderBy('name');
    }

    /**
     * The agents of the selection's projects, for an agent list; agents carry no scope of their own.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSelection(Builder $query, ProjectSelection $selection): void
    {
        new ProjectScope(static fn () => $selection, false)->apply($query, $query->getModel());
    }
}
