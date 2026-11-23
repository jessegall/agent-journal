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

#[Fillable(['supervisor_link_id', 'actor_type', 'actor_id', 'route', 'previous_target', 'target', 'version'])]
final class SupervisorChange extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.supervisor-change';

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    protected static function booted(): void
    {
        self::updating(fn () => throw SupervisorRouteRefused::historyEdited());
    }

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
}
