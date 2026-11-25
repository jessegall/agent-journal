<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\MainAgentMissing;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $agent_id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property Agent $agent
 */
#[Fillable(['agent_id'])]
final class MainAgentDesignation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * Designates the agent as the installation's main agent.
     */
    public static function create(Agent $agent): self
    {
        return self::query()->create(['agent_id' => $agent->id]);
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
     * @throws MainAgentMissing
     */
    public static function designatedAgent(): Agent
    {
        $designation = self::query()->with('agent')->firstOr(MainAgentMissing::throwing()->forInstallation());

        return $designation->agent;
    }

    /**
     * @return Option<string>
     */
    public static function designatedAgentId(): Option
    {
        return Option::fromValue(self::query()->value('agent_id'));
    }

    public static function isDesignated(): bool
    {
        return self::query()->exists();
    }
}
