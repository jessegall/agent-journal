<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Contracts\InboxProvider;
use App\Communication\Contracts\InboxRegistration;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Exceptions\InboxProviderInvalid;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\InboxRecord;
use Illuminate\Contracts\Container\Container;

/**
 * The inbox providers registered at boot, each under one key with the access that guards it, and the resolution of
 * an inbox id through the provider its record names.
 */
final class RegisteredInboxes implements InboxRegistration, InboxResolver
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
}
