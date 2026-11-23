<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxAccess;
use App\Contracts\Chat\InboxProvider;
use App\Contracts\Chat\InboxRegistration;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Chat\NamedInboxes;
use App\Exceptions\InboxProviderInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Chats\InboxRecord;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Builder;

/**
 * The inbox providers registered at boot, each under one key with the access that guards it, and the resolution of
 * an inbox id through the provider its record names.
 */
final class RegisteredInboxes implements InboxRegistration, InboxResolver
{
    /**
     * @var Registry<array{class-string<InboxProvider>, class-string<InboxAccess>}>
     */
    private readonly Registry $providers;

    public function __construct()
    {
        $this->providers = Registry::once(InboxUnavailable::forId(...), InboxProviderInvalid::repeated(...));
    }

    public function register(string $providerKey, string $providerClass, string $accessClass): void
    {
        if (! Reflector::factory()->isSubclassOf($providerClass, InboxProvider::class)) {
            throw InboxProviderInvalid::notAProvider($providerKey, $providerClass);
        }

        if (! Reflector::factory()->isSubclassOf($accessClass, InboxAccess::class)) {
            throw InboxProviderInvalid::withoutAccess($providerKey, $accessClass);
        }

        $this->providers->put($providerKey, [$providerClass, $accessClass]);
    }

    public function resolve(string $inboxId): Inbox
    {
        $record = InboxRecord::query()->findOr($inboxId, fn () => throw InboxUnavailable::forId($inboxId));
        [$providerClass] = $this->providers->find($record->provider_key)->getOrThrow(InboxUnavailable::forId($inboxId));

        return Container::getInstance()->make($providerClass)->inboxFor($record->id, $record->provider_id);
    }

    public function named(string $name): Inbox
    {
        foreach ($this->providers->all() as [$providerClass]) {
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

    public function accessFor(Inbox $inbox): InboxAccess
    {
        $record = InboxRecord::query()->findOr(
            $inbox->inboxId(),
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );

        [, $accessClass] = $this->providers->find($record->provider_key)
            ->getOrThrow(InboxUnavailable::forId($inbox->inboxId()));

        return Container::getInstance()->make($accessClass);
    }

    public function membersOf(Inbox $inbox): array
    {
        return $this->accessFor($inbox)->members($inbox)->memberships;
    }

    /**
     * Every registered provider's inboxes the actor is seated at, as one query.
     *
     * @return Builder<*>
     */
    public function inboxIdsOf(ActorIdentity $actor): Builder
    {
        $queries = array_map(
            fn (array $provider) => Container::getInstance()->make($provider[1])->memberInboxIds($actor),
            array_values($this->providers->all()),
        );

        $first = array_shift($queries) ?? InboxRecord::query()->whereKey([])->select('id');

        return array_reduce(
            $queries,
            fn (Builder $combinedMessages, Builder $more) => $combinedMessages->union($more),
            $first,
        );
    }
}
