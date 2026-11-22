<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Admission\JournalAdmission;
use App\Exceptions\ConsoleOwnerMissing;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;

/**
 * A console command acting as the journal's configured owner: the owner the admission names, under an owner
 * authority, until the command finishes, so the next command starts with no actor.
 */
final readonly class ConsoleOwner
{
    public function __construct(
        private JournalAdmission $admission,
        private CurrentActorSetter $actors,
        private RequestKey $key,
    ) {}

    /**
     * @throws ConsoleOwnerMissing
     */
    public function actAsOwner(): ActorContext
    {
        $owner = $this->admission->owner();
        $this->actors->set($owner, new OwnerAuthority('the console'));

        return $owner;
    }

    /**
     * Ends the actor's turn when a console command finishes, so the next command starts with none.
     */
    public function finish(): void
    {
        $this->actors->clear();
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
