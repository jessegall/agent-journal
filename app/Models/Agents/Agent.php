<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\TakesPartInMessages;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Contracts\Questions\AnswersQuestions;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\DriverType;
use App\Events\Sessions\AgentDriverTypePreferred;
use App\Events\Sessions\AgentRetired;
use App\Events\Sessions\AgentRuntimeAdopted;
use App\Events\Sessions\AgentRuntimesFenced;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Values\RunningRuntime;
use App\Values\StackTarget;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent the journal starts, with the profile it starts with and the work assigned to it. A retired agent
 * holds no work and cannot be started again.
 *
 * @property string $id
 * @property string|null $current_session_id
 * @property int $runtime_generation
 * @property DriverType|null $driver_type_preference
 * @property string $name
 * @property string $profile_key
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'profile_key'])]
final class Agent extends Model implements
    MessageReceiver,
    MessageSender,
    Assignee,
    EventSource,
    AnswersQuestions,
    ReadableModel
{
    use TakesPartInMessages;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['retired_at' => 'datetime', 'driver_type_preference' => DriverType::class];
    }

    // ----------[ Constructors ]----------

    /**
     * A new agent that starts with the profile of this key unless a start names another.
     */
    public static function create(string $name, string $profileKey): self
    {
        return self::query()->create(['name' => $name, 'profile_key' => $profileKey]);
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
            ->where('profile_key', $profile)
            ->whereNull('retired_at')
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

    // ----------[ Answers ]----------

    /**
     * The driver type a launch runs: the one it names, then the agent's saved preference, then its profile's default.
     */
    public function driverTypeFor(DriverType|null $named, DriverType $profileDefault): DriverType
    {
        return $named ?? $this->driver_type_preference ?? $profileDefault;
    }

    public function isCurrentRuntime(AgentSession $session): bool
    {
        return $this->current_session_id === $session->id;
    }

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    public function actorType(): ActorType
    {
        return ActorType::Agent;
    }

    public function actorId(): string
    {
        return $this->id;
    }

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
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
}
