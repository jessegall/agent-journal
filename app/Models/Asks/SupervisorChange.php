<?php

declare(strict_types=1);

namespace App\Models\Asks;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\SupervisorRouteRefused;
use App\Support\ActorIdentity;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $supervisor_link_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $route
 * @property string $previous_target
 * @property string $target
 * @property int $version
 * @property Carbon $created_at
 */
#[Fillable([
    'supervisor_link_id',
    'actor_type',
    'actor_id',
    'route',
    'previous_target',
    'target',
    'version',
])]
final class SupervisorChange extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    protected static function booted(): void
    {
        self::updating(fn (self $change) => $change->assertHistoryKept());
    }

    // ----------[ Constructors ]----------

    public static function create(
        SupervisorLink $link,
        ActorIdentity $author,
        AskTypeKey|null $type,
        SupervisorTarget $previous,
        SupervisorTarget $target,
    ): void {
        self::query()->create([
            'supervisor_link_id' => $link->id,
            'actor_type' => $author->type->value,
            'actor_id' => $author->id,
            'route' => AskTypeKey::routeOf($type),
            'previous_target' => $previous->key,
            'target' => $target->key,
            'version' => $link->versionFor($type),
        ]);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a change of the supervisor route is history and stays as it was written.
     *
     * @throws SupervisorRouteRefused
     */
    private function assertHistoryKept(): never
    {
        throw SupervisorRouteRefused::historyEdited();
    }
}
