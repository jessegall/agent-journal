<?php

declare(strict_types=1);

namespace App\Models\Asks;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\SupervisorLinks\SupervisorLinkChanged;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Values\AskTypeKey;
use App\Values\SupervisorRoutes;
use Carbon\CarbonImmutable;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property SupervisorRoutes $routes
 * @property array<string,int> $versions
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class SupervisorLink extends JournalModel implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column versions array<string,int>
     */
    protected function casts(): array
    {
        return [
            'routes' => SupervisorRoutes::class,
            'versions' => 'array',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(ActorReference $actor, SupervisorRoutes $inherited): self
    {
        $link = self::findOwnedBy($actor);

        if ($link !== null) {
            return $link;
        }

        $link = new self();
        $link->routes = $inherited;
        $link->versions = [];
        $link->belongTo($actor);

        return $link;
    }

    // ----------[ Mutations ]----------

    public function change(SupervisorRoutes $routes, AskTypeKey|null $type): void
    {
        $key = AskTypeKey::routeOf($type);
        $this->routes = $routes;

        $this->versions = [
            ...$this->versions,
            $key => $this->versionFor($type) + 1,
        ];

        $this->assertSaved($this->save());
        $this->raise(new SupervisorLinkChanged($this->id));
    }

    // ----------[ Calculations ]----------

    public function versionFor(AskTypeKey|null $type): int
    {
        return $this->versions[AskTypeKey::routeOf($type)] ?? 0;
    }

    // ----------[ Queries ]----------

    /**
     * @return array<string, SupervisorRoutes>
     */
    public static function resolveGraphRoutes(): array
    {
        $routes = [];

        self::query()->acrossActors()->readInChunks(50, function ($links) use (&$routes): void {
            foreach ($links as $link) {
                $routes[$link->actor_type.':'.strtolower($link->actor_id)] = $link->routes;
            }
        });

        return $routes;
    }

    /**
     * The actor's supervisor link; none before its first.
     */
    public static function findOwnedBy(ActorReference $actor): self|null
    {
        return self::query()->ownedBy($actor)->first();
    }
}
