<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Contracts\ForwardsToDesk;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Enums\ActorType;
use App\Agents\Support\RunningRuntime;
use App\Agents\Support\StackTarget;
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
 * An agent the journal starts, with the profile it starts with. It can hold assigned work until it is
 * retired; retirement is final.
 *
 * @property string $id
 * @property string|null $current_session_id
 * @property int $runtime_generation
 * @property string $name
 * @property string $profile_key
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'profile_key'])]
final class Agent extends Model implements Assignee, ForwardsToDesk, ReadableModel, ReceivesMessages, SendsMessages
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['retired_at' => 'datetime'];
    }

    /**
     * A new agent that starts with the profile of this key unless a start names another.
     */
    public static function named(string $name, string $profileKey): self
    {
        return self::query()->create(['name' => $name, 'profile_key' => $profileKey]);
    }

    /**
     * These agents by id, in one query, for trusted Core work over many sessions.
     *
     * @param  list<string>  $agentIds
     * @return array<string, self>
     */
    public static function byIds(array $agentIds): array
    {
        $agents = self::query()->whereKey($agentIds)->readLimit(max(1, count($agentIds)))->get();

        return $agents->keyBy('id')->all();
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

    public function retireAt(CarbonInterface $retiredAt): void
    {
        $this->retired_at = Carbon::instance($retiredAt);
        $this->save();
    }
}
