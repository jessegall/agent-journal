<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActiveActorCounterMissing;
use App\Actors\Exceptions\ActiveActorCounterRepeated;
use App\Registries\Support\Registry;
use Illuminate\Container\Container;

/**
 * The one counter of present actors for each actor type. It keeps class names only and builds a counter when one is
 * asked for, from the asking request's container, so a counter is never kept beyond its call.
 */
final class ActiveActorCounterRegistry implements ActiveActorRegistration
{
    /**
     * @var Registry<class-string<ActiveActorCounter>>
     */
    private readonly Registry $counters;

    public function __construct()
    {
        $this->counters = Registry::once(
            fn (string $type) => ActiveActorCounterMissing::for(ActorType::from($type)),
            fn (string $type) => ActiveActorCounterRepeated::for(ActorType::from($type)),
        );
    }

    /**
     * @param  class-string<ActiveActorCounter>  $class
     *
     * @throws ActiveActorCounterRepeated
     */
    public function register(string $class): void
    {
        $this->counters->put($class::type()->value, $class);
    }

    public function has(ActorType $type): bool
    {
        return $this->counters->has($type->value);
    }

    /**
     * @throws ActiveActorCounterMissing
     */
    public function get(ActorType $type): ActiveActorCounter
    {
        return Container::getInstance()->make($this->counters->get($type->value));
    }
}
