<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\MainAgentMissing;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOption\Option;

/**
 * Which agent is the installation's main agent: one row at most, which Home and admission read the main agent through.
 *
 * @property string $id
 * @property string $agent_id
 * @property-read Agent $agent
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

    // ----------[ Queries ]----------

    /**
     * @throws MainAgentMissing
     */
    public static function designatedAgent(): Agent
    {
        return self::query()->with('agent')->firstOr(fn () => throw MainAgentMissing::forInstallation())->agent;
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

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }
}
