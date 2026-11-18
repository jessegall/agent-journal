<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActiveActorCounterMissing;
use App\Actors\Exceptions\ActiveActorCounterRepeated;
use Illuminate\Contracts\Container\Container;

/**
 * The one counter of present actors for each actor type. It keeps class names only and builds a counter when one is
 * asked for, so a counter is never kept beyond its call.
 */
final class ActiveActorCounterRegistry
{
    /**
     * @var array<string, class-string<ActiveActorCounter>>
     */
    private array $counters = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<ActiveActorCounter>  $counterClass
     *
     * @throws ActiveActorCounterRepeated
     */
    public function register(string $counterClass): void
    {
        $type = $counterClass::type();

        if ($this->has($type)) {
            throw ActiveActorCounterRepeated::for($type);
        }

        $this->counters[$type->value] = $counterClass;
    }

    public function has(ActorType $type): bool
    {
        return array_key_exists($type->value, $this->counters);
    }

    /**
     * @throws ActiveActorCounterMissing
     */
    public function get(ActorType $type): ActiveActorCounter
    {
        $counterClass = $this->counters[$type->value] ?? throw ActiveActorCounterMissing::for($type);

        return $this->container->make($counterClass);
    }
}
