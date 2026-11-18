<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Support\ActorContext;
use App\Bus\Support\RequestKey;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Sharing\Exceptions\SharingOwnerMissing;
use Illuminate\Support\Str;

/**
 * Lets an owner command on the command line act as the journal's configured owner, once the access policy admits that
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
     * @throws SharingOwnerMissing
     * @throws SharingNotAllowed
     */
    public function actAsOwner(): ActorContext
    {
        $ownerId = $this->access->allowedUserIds()[0] ?? throw SharingOwnerMissing::forConsole();
        $owner = ActorContext::forUser($ownerId);

        if (! $this->access->allows($owner)) {
            throw SharingNotAllowed::forActor($owner);
        }

        $this->actors->set($owner);

        return $owner;
    }

    /**
     * Keys this command's write under the given key, or a new one; returns the key.
     */
    public function keyWrite(string|null $requestKey): string
    {
        $key = $requestKey ?? (string) Str::ulid();
        $this->key->set($key);

        return $key;
    }
}
