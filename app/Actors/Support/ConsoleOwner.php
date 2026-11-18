<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Actors\Exceptions\ConsoleOwnerRefused;
use App\Bus\Support\RequestKey;
use Illuminate\Support\Str;

/**
 * Lets an owner command on the command line act as the journal's configured owner user, once the access policy admits that
 * user, and keys its write so a retry with the same key answers from the receipt.
 */
final readonly class ConsoleOwner
{
    public function __construct(
        private JournalAccessPolicy $access,
        private CurrentActorSetter $actors,
        private RequestKey $key,
    ) {}

    /**
     * @throws ConsoleOwnerMissing
     * @throws ConsoleOwnerRefused
     */
    public function actAsOwner(): ActorContext
    {
        $ownerId = $this->access->allowedUserIds()[0] ?? throw ConsoleOwnerMissing::forConsole();
        $owner = ActorContext::forUser($ownerId);

        if (! $this->access->allows($owner)) {
            throw ConsoleOwnerRefused::forActor($owner);
        }

        $this->actors->set($owner);

        return $owner;
    }

    /**
     * Keys this command's write under the given key, or a new one; returns the key.
     */
    public function useRequestKey(string|null $requestKey): string
    {
        $key = $requestKey ?? (string) Str::ulid();
        $this->key->set($key);

        return $key;
    }
}
