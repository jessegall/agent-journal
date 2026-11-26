<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Exceptions\InboxUnavailable;
use App\Inboxes\Contracts\InboxProvider;
use App\Inboxes\Contracts\InboxRegistration;
use App\Inboxes\Contracts\InboxResolver;
use App\Inboxes\Contracts\LabeledInbox;
use App\Inboxes\Contracts\NamedInboxes;
use App\Inboxes\Exceptions\InboxProviderInvalid;
use App\Models\Inboxes\Inbox;
use App\Support\Reflector;
use App\Support\Registry;
use Illuminate\Container\Container;

/**
 * The inbox providers registered at boot, each under one key with the access that guards it, and the resolution of
 * an inbox id through the provider its record names.
 */
final class RegisteredInboxes implements InboxRegistration, InboxResolver
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

    public function resolve(string $inboxId): LabeledInbox
    {
        $record = Inbox::query()->findOr($inboxId, InboxUnavailable::throwing()->forId($inboxId));
        $providerClass = $this->providers->find($record->provider_key)->getOrThrow(InboxUnavailable::forId($inboxId));

        return Container::getInstance()->make($providerClass)->inboxFor($record->id, $record->provider_id);
    }

    public function named(string $name): LabeledInbox
    {
        foreach ($this->providers->all() as $providerClass) {
            $provider = Container::getInstance()->make($providerClass);

            if (! $provider instanceof NamedInboxes) {
                continue;
            }

            $inbox = $provider->inboxNamed($name);

            if ($inbox->isDefined()) {
                return $inbox->get();
            }
        }

        throw InboxUnavailable::forName($name);
    }
}
