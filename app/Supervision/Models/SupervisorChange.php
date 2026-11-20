<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorTarget;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Supervision\Exceptions\SupervisorRouteRefused;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['supervisor_link_id', 'actor_type', 'actor_id', 'route', 'previous_target', 'target', 'version'])]
final class SupervisorChange extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.supervisor-change';

    public const null UPDATED_AT = null;

    protected static function booted(): void
    {
        self::updating(fn () => throw SupervisorRouteRefused::historyEdited());
    }

    public static function record(
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
}
