<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActiveActorCounter;
use App\Contracts\Actors\ActiveActorRegistration as ActiveActorRegistrationContract;
use App\Exceptions\ActiveActorCounterMissing;
use App\Exceptions\ActiveActorCounterRepeated;
use Illuminate\Container\Container;

/**
 * The one counter of present actors for each actor type. It keeps class names only and builds a counter when one is
 * asked for, from the asking request's container, so a counter is never kept beyond its call.
 */
final class ActiveActorRegistration implements ActiveActorRegistrationContract
{
    /**
     * @var Registry<class-string<ActiveActorCounter>>
     */
    private readonly Registry $counters;

    public function __construct()
    {
        $this->counters = Registry::once(
            fn (string $type) => ActiveActorCounterMissing::for($type),
            fn (string $type) => ActiveActorCounterRepeated::for($type),
        );
    }

    /**
     * @param  class-string<ActiveActorCounter>  $class
     *
     * @throws ActiveActorCounterRepeated
     */
    public function register(string $class): void
    {
        $this->counters->put($class::type(), $class);
    }

    public function has(string $type): bool
    {
        return $this->counters->has($type);
    }

    /**
     * @throws ActiveActorCounterMissing
     */
    public function get(string $type): ActiveActorCounter
    {
        return Container::getInstance()->make($this->counters->get($type));
    }
}
