<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Exceptions\NotificationTargetUnregistered;
use App\Registries\Support\Registry;

/**
 * The resolver of each notification target key, such as chat.question, registered once at boot.
 */
final class NotificationTargetRegistry
{
    /**
     * @var Registry<NotificationTargetResolver>
     */
    private readonly Registry $resolvers;

    public function __construct()
    {
        $this->resolvers = Registry::once(
            NotificationTargetUnregistered::forKey(...),
            NotificationTargetUnregistered::twice(...),
        );
    }

    public function register(string $key, NotificationTargetResolver $resolver): void
    {
        $this->resolvers->put($key, $resolver);
    }

    /**
     * @throws NotificationTargetUnregistered
     */
    public function resolverFor(string $key): NotificationTargetResolver
    {
        return $this->resolvers->get($key);
    }
}
