<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Contracts\InboxProvider;
use App\Communication\Contracts\InboxRegistration;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\MemberInboxes;
use App\Communication\Contracts\NamesInboxes;
use App\Communication\Exceptions\InboxProviderInvalid;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\InboxRecord;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Builder;

/**
 * The inbox providers registered at boot, each under one key with the access that guards it, and the resolution of
 * an inbox id through the provider its record names.
 */
final class RegisteredInboxes implements InboxRegistration, InboxResolver, MemberInboxes
{
    /**
     * @var array<string, array{class-string<InboxProvider>, class-string<InboxAccess>}>
     */
    private array $providers = [];

    public function __construct(private readonly Container $container) {}

    public function register(string $providerKey, string $providerClass, string $accessClass): void
    {
        if (array_key_exists($providerKey, $this->providers)) {
            throw InboxProviderInvalid::repeated($providerKey);
        }

        if (! is_subclass_of($providerClass, InboxProvider::class)) {
            throw InboxProviderInvalid::notAProvider($providerKey, $providerClass);
        }

        if (! is_subclass_of($accessClass, InboxAccess::class)) {
            throw InboxProviderInvalid::withoutAccess($providerKey, $accessClass);
        }

        $this->providers[$providerKey] = [$providerClass, $accessClass];
    }

    public function resolve(string $inboxId): Inbox
    {
        $record = InboxRecord::query()->find($inboxId) ?? throw InboxUnavailable::forId($inboxId);
        [$providerClass] = $this->providers[$record->provider_key] ?? throw InboxUnavailable::forId($inboxId);

        return $this->container->make($providerClass)->inboxFor($record->id, $record->provider_id);
    }

    public function named(string $name): Inbox
    {
        foreach ($this->providers as [$providerClass]) {
            $provider = $this->container->make($providerClass);

            if (! $provider instanceof NamesInboxes) {
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
        $record = InboxRecord::query()->find($inbox->inboxId()) ?? throw InboxUnavailable::forId($inbox->inboxId());
        [, $accessClass] = $this->providers[$record->provider_key] ?? throw InboxUnavailable::forId($inbox->inboxId());

        return $this->container->make($accessClass);
    }

    public function membersOf(Inbox $inbox): array
    {
        return $this->accessFor($inbox)->members($inbox)->memberships;
    }

    /**
     * Every registered provider's inboxes the actor is seated at, as one query.
     */
    public function inboxIdsOf(ActorIdentity $actor): Builder
    {
        $queries = array_map(
            fn (array $provider) => $this->container->make($provider[1])->memberInboxIds($actor),
            array_values($this->providers),
        );
        $first = array_shift($queries) ?? InboxRecord::query()->whereKey([])->select('id');

        return array_reduce($queries, fn (Builder $all, Builder $more) => $all->union($more), $first);
    }
}
