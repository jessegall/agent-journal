<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

use App\Inboxes\Exceptions\InboxProviderInvalid;

/**
 * Where an owner of inboxes registers its provider under one key.
 */
interface InboxRegistration
{
    /**
     * @param  string  $providerClass  a class name, refused unless it is an InboxProvider
     *
     * @throws InboxProviderInvalid
     */
    public function register(string $providerKey, string $providerClass): void;
}
