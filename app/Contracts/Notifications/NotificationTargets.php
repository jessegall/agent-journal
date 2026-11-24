<?php

declare(strict_types=1);

namespace App\Contracts\Notifications;

/**
 * Where a domain registers the resolver of its own notification target key, such as report, at boot.
 */
interface NotificationTargets
{
    /**
     * @param  class-string<NotificationTargetResolver>  $resolverClass
     */
    public function register(string $key, string $resolverClass): void;
}
