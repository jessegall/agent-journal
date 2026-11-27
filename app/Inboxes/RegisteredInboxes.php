<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Exceptions\InboxUnavailable;
use App\Inboxes\Contracts\InboxProvider;
use App\Inboxes\Contracts\InboxRegistration;
use App\Inboxes\Exceptions\InboxProviderInvalid;
use App\Support\Reflector;
use App\Support\Registry;

/**
 * The inbox providers registered at boot, each under one key.
 */
final class RegisteredInboxes implements InboxRegistration
{
    /**
     * @var Registry<class-string<InboxProvider>>
     */
    private readonly Registry $providers;

    public function __construct()
    {
        $this->providers = Registry::once(InboxUnavailable::forId(...), InboxProviderInvalid::repeated(...));
    }

    public function register(string $providerKey, string $class): void
    {
        if (! Reflector::factory()->isSubclassOf($class, InboxProvider::class)) {
            throw InboxProviderInvalid::notAProvider($providerKey, $class);
        }

        $this->providers->put($providerKey, $class);
    }
}
