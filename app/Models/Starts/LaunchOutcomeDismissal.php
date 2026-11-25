<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Starts\StartDisposition;
use App\Support\ActorIdentity;
use App\Support\LaunchOutcome;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $viewer_type
 * @property string $viewer_id
 * @property string $agent_id
 * @property string $request_id
 * @property string $outcome_version
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class LaunchOutcomeDismissal extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * The viewer's dismissal of this version of the start's outcome; dismissing it again keeps the one already there, by the table's unique key.
     */
    public static function create(ActorIdentity $viewer, StartRecord $start, StartDisposition $version): void
    {
        $dismissal = new self();
        $dismissal->viewer_type = $viewer->type->value;
        $dismissal->viewer_id = $viewer->id;
        $dismissal->agent_id = $start->agent_id;
        $dismissal->request_id = $start->request_id;
        $dismissal->outcome_version = $version->value;

        $dismissal->id = $dismissal->newUniqueId();
        $dismissal->insertIfAbsent();
    }

    // ----------[ Queries ]----------

    /**
     * The keys of the outcomes the viewer dismissed among these start requests', each as request id and version.
     *
     * @param  list<string>  $requestIds
     * @return list<string>
     */
    public static function dismissedKeysOf(ActorIdentity $viewer, array $requestIds): array
    {
        return array_values(self::query()
            ->dismissedBy($viewer)
            ->ofRequests($requestIds)
            ->readExactly(count($requestIds) * count(StartDisposition::cases()))
            ->get()
            ->map(fn (self $dismissal) => LaunchOutcome::keyOf($dismissal->request_id, $dismissal->outcome_version))
            ->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function dismissedBy(Builder $query, ActorIdentity $viewer): void
    {
        $query->where('viewer_type', $viewer->type->value)->where('viewer_id', $viewer->id);
    }

    /**
     * The dismissals of the start requests.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $requestIds
     */
    #[Scope]
    protected function ofRequests(Builder $query, array $requestIds): void
    {
        $query->whereIn('request_id', $requestIds);
    }
}
