<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Concerns\TakesPartInMessages;
use App\Contracts\Actors\RecipientActor;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Events\EventSource;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Questions\QuestionRecipient;
use App\Contracts\Records\ReadableModel;
use App\Enums\Drivers\DriverType;
use App\Events\Sessions\AgentDriverTypePreferred;
use App\Events\Sessions\AgentRetired;
use App\Events\Sessions\AgentRuntimeAdopted;
use App\Events\Sessions\AgentRuntimesFenced;
use App\Exceptions\ModelMissing;
use App\Models\Inboxes\InboxMember;
use App\Models\Projects\Project;
use App\Models\Support\HasProjectColumn;
use App\Models\Support\ProjectScope;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Values\ProjectSelection;
use App\Values\RunningRuntime;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
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
final class Agent extends Model implements
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
    use HasUlids;
    use Linkable;
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
        $agent->assertSaved($agent->save());

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
        $this->assertSaved($this->save());
        $this->raise(new AgentDriverTypePreferred($this->id, $driverType));
    }

    /**
     * Makes the session the agent's current runtime under a new generation; every earlier runtime is fenced.
     */
    public function adoptRuntime(AgentSession $session): void
    {
        $this->runtime_generation++;
        $this->current_session_id = $session->id;
        $this->assertSaved($this->save());
        $this->raise(new AgentRuntimeAdopted($this->id, $session->id, $this->runtime_generation));
    }

    /**
     * Ends every runtime of the agent: no session stays current, so each of its credentials is refused.
     */
    public function fenceRuntimes(): void
    {
        $this->runtime_generation++;
        $this->current_session_id = null;
        $this->assertSaved($this->save());
        $this->raise(new AgentRuntimesFenced($this->id, $this->runtime_generation));
    }

    public function retireAt(CarbonInterface $retiredAt): void
    {
        $this->retired_at = CarbonImmutable::instance($retiredAt);
        $this->assertSaved($this->save());
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

    /**
     * The driver type a start runs: the one it names, then the agent's saved preference, then its profile's default.
     */
    public function driverTypeFor(DriverType|null $named, DriverType $profileDefault): DriverType
    {
        return $named ?? $this->driver_type_preference ?? $profileDefault;
    }

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

    // ----------[ Calculations ]----------

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
    public static function findProjectIdOf(string $agentId): string
    {
        return self::query()->whereKey($agentId)->firstOr(
            static fn () => throw ModelMissing::for(self::class, $agentId),
        )->project_id;
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
        $agents = self::query()->whereKey($ids)->readExactly(max(1, count($ids)))->get();

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
     * The rows by created at, then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byCreatedAt(Builder $query): void
    {
        $query->orderBy('created_at');
        $query->orderBy('id');
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
        new ProjectScope(static fn (): ProjectSelection => $selection, false)->apply($query, $query->getModel());
    }
}
