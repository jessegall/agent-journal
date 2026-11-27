<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\BindingRuntimeRecorded;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $binding_id
 * @property string $start_id
 * @property string $session_id
 * @property string $runtime_id
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
final class BindingRuntime extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * Records the start under its id with the runtime it opened.
     */
    public static function create(string $bindingId, string $startId, string $sessionId, string $runtimeId): self
    {
        $start = new self();
        $start->binding_id = $bindingId;
        $start->start_id = $startId;
        $start->session_id = $sessionId;
        $start->runtime_id = $runtimeId;
        $start->saveAndAssert();
        $start->raise(new BindingRuntimeRecorded($bindingId, $startId, $runtimeId, CarbonImmutable::now()));

        return $start;
    }

    // ----------[ Queries ]----------

    /**
     * The runtime the binding's start under this id opened, none or one.
     *
     * @return list<AgentRuntime>
     */
    public static function resolveRuntimeForBinding(string $bindingId, string $startId): array
    {
        $runtimeIds = self::query()->ofBindingAndStart($bindingId, $startId)->select('runtime_id');

        return array_values(AgentRuntime::query()->withIds($runtimeIds)->limit(1)->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The binding's row for the start.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofBindingAndStart(Builder $query, string $bindingId, string $startId): void
    {
        $query->where('binding_id', $bindingId)->where('start_id', $startId);
    }
}
