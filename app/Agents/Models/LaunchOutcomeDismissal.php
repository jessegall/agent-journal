<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\StartDisposition;
use App\Agents\Support\LaunchOutcome;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One viewer dismissed one version of an agent's launch outcome; a newer outcome of the same start, or a newer start,
 * shows again.
 *
 * @property string $id
 * @property string $viewer_type
 * @property string $viewer_id
 * @property string $agent_id
 * @property string $request_id
 * @property string $outcome_version
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['viewer_type', 'viewer_id', 'agent_id', 'request_id', 'outcome_version'])]
final class LaunchOutcomeDismissal extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * The viewer's dismissal of this version of the start's outcome; dismissing it again keeps the one already there.
     */
    public static function dismiss(ActorIdentity $viewer, StartRecord $start, StartDisposition $version): self
    {
        return self::query()->firstOrCreate([
            ...$viewer->asColumns('viewer'),
            'agent_id' => $start->agent_id,
            'request_id' => $start->request_id,
            'outcome_version' => $version->value,
        ]);
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
            ->whereIn('request_id', $requestIds)
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
}
