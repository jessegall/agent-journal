<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\AuthoritySource;
use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\Command;

/**
 * An agent's authority: the admitted profile revision its session was started with.
 */
final readonly class StartProfileAuthority implements AuthoritySource
{
    public function __construct(public ProfileSnapshot $profile) {}

    /**
     * Whether the pinned profile admits this application command.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function admits(string $command, Authorize $authorize): bool
    {
        return $this->profile->admits($command, $authorize)->allowed;
    }

    public function description(): string
    {
        return "revision {$this->profile->revision} of profile {$this->profile->key->key}";
    }

    public function mayRunApplicationCommands(): bool
    {
        return true;
    }

    public function profileKey(): string
    {
        return (string) $this->profile->key;
    }
}
