<?php

declare(strict_types=1);

namespace App\Agents\Models;

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
final class Agent extends Model implements Assignee, ReadableModel
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
