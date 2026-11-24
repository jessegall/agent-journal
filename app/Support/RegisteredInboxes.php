<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Inboxes\InboxProvider;
use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Inboxes\InboxResolver;
use App\Contracts\Inboxes\NamedInboxes;
use App\Exceptions\InboxProviderInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\Inbox;
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

    public function register(string $providerKey, string $providerClass): void
    {
        if (! Reflector::factory()->isSubclassOf($providerClass, InboxProvider::class)) {
            throw InboxProviderInvalid::notAProvider($providerKey, $providerClass);
        }

        $this->providers->put($providerKey, $providerClass);
    }

    public function resolve(string $inboxId): LabeledInbox
    {
        $record = Inbox::query()->findOr($inboxId, fn () => throw InboxUnavailable::forId($inboxId));
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
