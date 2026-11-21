<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Contracts\MessageRecipient;
use App\Actors\Contracts\MessageSender;
use App\Actors\Contracts\SeatedActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\DriverVariant;
use App\Agents\Values\RunningRuntime;
use App\Agents\Values\StackTarget;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Support\AssigneeIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
 * @property DriverVariant|null $variant_preference
 * @property string $name
 * @property string $profile_key
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'profile_key'])]
final class Agent extends Model implements Assignee, MessageRecipient, MessageSender, ReadableModel, SeatedActor
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['retired_at' => 'datetime', 'variant_preference' => DriverVariant::class];
    }

    /**
     * A new agent that starts with the profile of this key unless a start names another.
     */
    public static function create(string $name, string $profileKey): self
    {
        return self::query()->create(['name' => $name, 'profile_key' => $profileKey]);
    }

    // ----------[ Queries ]----------

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
     * The variant this agent's launches use from now on when they name none, kept once a launch that asked to save it
     * runs.
     */
    public function preferVariant(DriverVariant $variant): void
    {
        $this->variant_preference = $variant;
        $this->save();
    }

    /**
     * Makes the session the agent's current runtime under a new generation; every earlier runtime is fenced.
     */
    public function adoptRuntime(AgentSession $session): void
    {
        $this->runtime_generation++;
        $this->current_session_id = $session->id;
        $this->save();
    }

    /**
     * Ends every runtime of the agent: no session stays current, so each of its credentials is refused.
     */
    public function fenceRuntimes(): void
    {
        $this->runtime_generation++;
        $this->current_session_id = null;
        $this->save();
    }

    public function retireAt(CarbonInterface $retiredAt): void
    {
        $this->retired_at = Carbon::instance($retiredAt);
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The variant a launch runs: the one it names, then the agent's saved preference, then its profile's default.
     */
    public function variantFor(DriverVariant|null $named, DriverVariant $profileDefault): DriverVariant
    {
        return $named ?? $this->variant_preference ?? $profileDefault;
    }

    public function isCurrentRuntime(AgentSession $session): bool
    {
        return $this->current_session_id === $session->id;
    }

    /**
     * The runtime of the current session, when that session runs under a driver that can be woken.
     *
     * @return Option<RunningRuntime>
     */
    public function currentRuntime(): Option
    {
        if ($this->current_session_id === null || ! AgentRuntime::existsForSession($this->current_session_id)) {
            return None::create();
        }

        $target = new StackTarget($this->id, $this->current_session_id);

        return Some::create(new RunningRuntime($target, $this->runtime_generation));
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
}
