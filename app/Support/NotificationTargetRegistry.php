<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\NotificationTargetResolver;
use App\Contracts\NotificationTargets;
use App\Exceptions\NotificationTargetUnregistered;
use Illuminate\Container\Container;

/**
 * The resolver class of each notification target key, such as chat.question, registered once at boot and made
 * for each read, so it answers for the actor of that request.
 */
final class NotificationTargetRegistry implements NotificationTargets
{
    /**
     * @var Registry<class-string<NotificationTargetResolver>>
     */
    private readonly Registry $resolvers;

    public function __construct()
    {
        $this->resolvers = Registry::once(
            NotificationTargetUnregistered::forKey(...),
            NotificationTargetUnregistered::twice(...),
        );
    }

    /**
     * @param  class-string<NotificationTargetResolver>  $resolverClass
     */
    public function register(string $key, string $resolverClass): void
    {
        $this->resolvers->put($key, $resolverClass);
    }

    /**
     * @throws NotificationTargetUnregistered
     */
    public function resolverFor(string $key): NotificationTargetResolver
    {
        return Container::getInstance()->make($this->resolvers->get($key));
    }
}
