<?php

declare(strict_types=1);

namespace App\Mcp\Models;

use App\Actors\Contracts\ActorVisibility;
use App\Agents\Support\AgentContext;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The ordered references a byte-shortened numbered page still owes its caller, kept for the continuation's lifetime.
 * Every query sees only the calling agent session's pages.
 *
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property list<string> $references
 * @property CarbonImmutable $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['agent_id', 'session_id', 'references', 'expires_at'])]
final class RetainedPage extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable, MassPrunable;

    public const string LINK_TYPE = 'core.mcp-retained-page';

    protected $table = 'core_mcp_retained_pages';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['references' => 'array', 'expires_at' => 'immutable_datetime'];
    }

    protected static function booted(): void
    {
        self::addGlobalScope(new AgentSessionScope(
            static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            static fn (): AgentContext => Container::getInstance()->make(AgentContext::class),
        ));
    }

    /**
     * Keeps the page's references for the calling session until they expire.
     *
     * @param  list<string>  $references
     */
    public static function keep(AgentContext $agent, array $references, CarbonImmutable $expiresAt): self
    {
        return self::query()->create([
            'agent_id' => $agent->agentId,
            'session_id' => $agent->sessionId,
            'references' => $references,
            'expires_at' => $expiresAt,
        ]);
    }

    /**
     * Pages past their expiry, of every session, for the daily prune.
     *
     * @return Builder<self>
     */
    public function prunable(): Builder
    {
        return self::query()->withoutGlobalScope(AgentSessionScope::class)->where('expires_at', '<', CarbonImmutable::now());
    }
}
