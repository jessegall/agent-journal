<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Exceptions\InboxProviderInvalid;

/**
 * Where an owner of inboxes registers its provider and the access that guards its membership, under one key.
 */
interface InboxRegistration
{
    /**
     * @param  class-string<InboxProvider>  $providerClass
     * @param  class-string<InboxAccess>  $accessClass
     *
     * @throws InboxProviderInvalid
     */
    public function register(string $providerKey, string $providerClass, string $accessClass): void;
}
