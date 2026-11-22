<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\ChildCheckout;

/**
 * What a host needs to make a claimed start's process: its key for every later report, the session, the account
 * folder on the host with the sign-in generation it runs in and the method its account signed in by, the driver's
 * checked recipe for running on it, and the native conversation a resume continues, if the agent has one under the
 * start's context; for a connected project's child also the checkout its own worktree is prepared for.
 */
final readonly class ClaimedStart
{
    /**
     * @param  list<ChildCheckout>  $childCheckouts  the child's checkout, none or one
     */
    public function __construct(
        public string $startKey,
        public string $sessionId,
        public string $directory,
        public int $generation,
        public string $signInMethod,
        public AccountStartRecipe $recipe,
        public string|null $conversationTarget,
        public bool $conversationRequired,
        public array $childCheckouts = [],
    ) {}
}
