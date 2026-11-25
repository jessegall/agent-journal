<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Concerns\TakesPartInMessages;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Events\EventSource;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Contracts\Questions\AnswersQuestions;
use App\Contracts\Records\ReadableModel;
use App\Enums\Assignments\ActorType;
use App\Enums\Drivers\DriverType;
use App\Events\Sessions\AgentDriverTypePreferred;
use App\Events\Sessions\AgentRetired;
use App\Events\Sessions\AgentRuntimeAdopted;
use App\Events\Sessions\AgentRuntimesFenced;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Values\RunningRuntime;
use App\Values\StackTarget;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $name
 * @property string $profile_key
 * @property ?Carbon $retired_at
 * @property ?string $current_session_id
 * @property int $runtime_generation
 * @property ?DriverType $driver_type_preference
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property Collection<int, InboxMember>|InboxMember[] $inboxMemberships
 */
final class Agent extends Model implements
    AnswersQuestions,
    Assignee,
    EventSource,
    MessageReceiver,
    MessageSender,
    ReadableModel
{
    use BoundedReads;
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
     * A new agent that starts with the profile of this key unless a start names another.
     */
    public static function create(string $name, string $profileKey): self
    {
        $agent = new self();
        $agent->name = $name;
        $agent->profile_key = $profileKey;
        $agent->assertSaved($agent->save());

        return $agent;
    }

    // ----------[ Mutations ]----------

    /**
     * The driver type this agent's launches use from now on when they name none, kept once a launch that asked to save it
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
        $this->retired_at = Carbon::instance($retiredAt);
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
     * The driver type a launch runs: the one it names, then the agent's saved preference, then its profile's default.
     */
    public function driverTypeFor(DriverType|null $named, DriverType $profileDefault): DriverType
    {
        return $named ?? $this->driver_type_preference ?? $profileDefault;
    }

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    public function actorType(): ActorType
    {
        return ActorType::Agent;
    }

    /**
     * The runtime of the current session, when that session runs under a driver that can be woken.
     *
     * @return Option<RunningRuntime>
     */
    public function currentRuntime(): Option
    {
        if ($this->current_session_id === null || ! AgentRuntime::runsForSession($this->current_session_id)) {
            return None::create();
        }

        $target = new StackTarget($this->id, $this->current_session_id);

        return Some::create(new RunningRuntime($target, $this->runtime_generation));
    }

    // ----------[ Calculations ]----------

    public function actorId(): string
    {
        return $this->id;
    }

    // ----------[ Queries ]----------

    /**
     * The agent with this id, if there is one.
     *
     * @return Option<self>
     */
    public static function withId(string $id): Option
    {
        return self::query()->whereKey($id)->firstOption();
    }

    /**
     * @return Option<ActorIdentity>
     */
    public static function soleActorForProfile(string $profile): Option
    {
        $matches = self::query()
            ->ofProfile($profile)
            ->unretired()
            ->limit(2)
            ->get();

        if ($matches->count() !== 1) {
            return None::create();
        }

        return Some::create(ActorIdentity::of($matches->sole()));
    }

    /**
     * These agents by id, in one query, for trusted Core work over many sessions.
     *
     * @param  list<string>  $ids
     * @return array<string, self>
     */
    public static function byIds(array $ids): array
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
}
