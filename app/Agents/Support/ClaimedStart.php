<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What a host needs to make a claimed start's process: its key for every later report, the session, the account
 * folder on the host with the sign-in generation it runs in and the method its account signed in by, the program's
 * checked recipe for running on it, and the native conversation a resume continues, if the agent has one under the
 * start's context.
 */
final readonly class ClaimedStart
{
    public function __construct(
        public string $startKey,
        public string $sessionId,
        public string $directory,
        public int $generation,
        public string $signInMethod,
        public AccountStartRecipe $recipe,
        public string|null $conversationTarget,
        public bool $conversationRequired,
    ) {}
}
