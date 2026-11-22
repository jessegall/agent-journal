<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Exceptions\InboxProviderInvalid;

/**
 * Where an owner of inboxes registers its provider and the access that guards its membership, under one key.
 */
interface InboxRegistration
{
    /**
     * @param  string  $providerClass  a class name, refused unless it is an InboxProvider
     * @param  string  $accessClass  a class name, refused unless it is an InboxAccess
     *
     * @throws InboxProviderInvalid
     */
    public function register(string $providerKey, string $providerClass, string $accessClass): void;
}
