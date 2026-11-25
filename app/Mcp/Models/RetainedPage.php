<?php

declare(strict_types=1);

namespace App\Mcp\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\AgentSessionScope;
use App\Support\AgentContext;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $session_id
 * @property array $references
 * @property CarbonImmutable $expires_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class RetainedPage extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use MassPrunable;

    protected $table = 'core_mcp_retained_pages';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'references' => 'array',
            'expires_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::addGlobalScope(new AgentSessionScope(
            static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            static fn (): AgentContext => Container::getInstance()->make(AgentContext::class),
        ));
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps the page's references for the calling session until they expire.
     *
     * @param  list<string>  $references
     */
    public static function create(AgentContext $agent, array $references, CarbonImmutable $expiresAt): self
    {
        $page = new self();
        $page->agent_id = $agent->agentId;
        $page->session_id = $agent->sessionId;
        $page->references = $references;
        $page->expires_at = $expiresAt;
        $page->save();

        return $page;
    }

    // ----------[ Transformers ]----------

    /**
     * Pages past their expiry, of every session, for the daily prune.
     *
     * @return Builder<self>
     */
    public function prunable(): Builder
    {
        return self::query()->withoutGlobalScope(AgentSessionScope::class)->expired();
    }

    // ----------[ Scopes ]----------

    /**
     * The pages past their expiry.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expired(Builder $query): void
    {
        $query->where('expires_at', '<', CarbonImmutable::now());
    }

    /**
     * The pages that have not expired at the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unexpiredAt(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('expires_at', '>=', $moment);
    }
}
