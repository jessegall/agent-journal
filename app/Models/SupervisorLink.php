<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\SupervisorRoutesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Values\AskTypeKey;
use App\Values\SupervisorRoutes;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property SupervisorRoutes $routes
 * @property array<string, int> $versions
 */
#[Fillable(['routes', 'versions'])]
final class SupervisorLink extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.supervisor-link';

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['routes' => SupervisorRoutesCast::class, 'versions' => 'array'];
    }

    public static function ofActor(ActorIdentity $actor, SupervisorRoutes $inherited): self
    {
        $link = self::query()->ownedBy($actor)->first();

        if ($link !== null) {
            return $link;
        }

        $link = new self(['routes' => $inherited, 'versions' => []]);
        $link->belongTo($actor);

        return $link;
    }

    // ----------[ Queries ]----------

    /**
     * @return array<string, SupervisorRoutes>
     */
    public static function graphRoutes(): array
    {
        $routes = [];

        self::query()->acrossActors()->readInChunks(50, function ($links) use (&$routes): void {
            foreach ($links as $link) {
                $routes[$link->actor_type.':'.strtolower($link->actor_id)] = $link->routes;
            }
        });

        return $routes;
    }

    // ----------[ Mutations ]----------

    public function change(SupervisorRoutes $routes, AskTypeKey|null $type): void
    {
        $key = AskTypeKey::routeOf($type);
        $this->routes = $routes;
        $this->versions = [...$this->versions, $key => $this->versionFor($type) + 1];
        $this->save();
    }

    // ----------[ Answers ]----------

    public function versionFor(AskTypeKey|null $type): int
    {
        return $this->versions[AskTypeKey::routeOf($type)] ?? 0;
    }
}
