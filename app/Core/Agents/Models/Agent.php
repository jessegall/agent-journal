<?php

declare(strict_types=1);

namespace App\Core\Agents\Models;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Contracts\Assignee;
use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Links\Support\Linkable;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * An agent the journal launches, with the role its bottom state follows. It can hold assigned work until it is
 * retired; retirement is final.
 *
 * @property int $id
 * @property string $name
 * @property string $role
 * @property Carbon|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'role'])]
final class Agent extends Model implements Assignee
{
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['retired_at' => 'datetime'];
    }

    public function actorKind(): ActorKind
    {
        return ActorKind::Agent;
    }

    public function actorId(): int
    {
        return $this->id;
    }

    public function isMainAgent(): bool
    {
        return $this->role === ReadyStateType::MainAgent->value;
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
