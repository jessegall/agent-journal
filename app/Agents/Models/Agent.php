<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Enums\ActorType;
use App\Agents\Enums\AgentRole;
use App\Assignments\Contracts\Assignee;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * An agent the journal launches, with the role its bottom state follows. It can hold assigned work until it is
 * retired; retirement is final.
 *
 * @property string $id
 * @property string $name
 * @property string $role
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'role'])]
final class Agent extends Model implements Assignee, ReadableModel, ReceivesMessages, SendsMessages
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

    public static function named(string $name, AgentRole $role): self
    {
        return self::query()->create(['name' => $name, 'role' => $role->value]);
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

    public function actorType(): ActorType
    {
        return ActorType::Agent;
    }

    public function actorId(): string
    {
        return $this->id;
    }

    public function isMainAgent(): bool
    {
        return $this->role === AgentRole::MainAgent->value;
    }

    /**
     * The role the agent was registered with.
     */
    public function agentRole(): AgentRole
    {
        return AgentRole::from($this->role);
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
