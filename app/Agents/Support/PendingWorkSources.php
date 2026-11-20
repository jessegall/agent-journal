<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\PendingWorkSource;
use Illuminate\Contracts\Container\Container;

/**
 * The modules that count an actor's pending work, registered by their service providers. It keeps class names only
 * and builds each source when it is asked, so a wake of an idle session can tell whether there is anything to do.
 */
final class PendingWorkSources
{
    /**
     * @var list<class-string<PendingWorkSource>>
     */
    private array $sources = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<PendingWorkSource>  $class
     */
    public function register(string $class): void
    {
        $this->sources[] = $class;
    }

    public function hasWorkFor(ActorIdentity $actor): bool
    {
        foreach ($this->sources as $sourceClass) {
            if ($this->container->make($sourceClass)->pendingCount($actor) > 0) {
                return true;
            }
        }

        return false;
    }
}
