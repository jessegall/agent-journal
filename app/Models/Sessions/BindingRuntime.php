<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Connections\BindingRuntimeRecorded;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

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
final class BindingRuntime extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        $start->assertSaved($start->save());
        $start->raise(new BindingRuntimeRecorded($bindingId, $startId, $runtimeId, CarbonImmutable::now()));

        return $start;
    }

    // ----------[ Queries ]----------

    /**
     * The start of the binding under this id, none or one.
     *
     * @return list<self>
     */
    public static function ofBinding(string $bindingId, string $startId): array
    {
        return array_values(self::query()->ofBindingAndStart($bindingId, $startId)->limit(1)
            ->get()->all());
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
