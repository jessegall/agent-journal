<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Accounts\AccountStartRecipe;

/**
 * What a host needs to make a claimed start's process: its report key, the session, the account folder with its sign-in
 * generation and method, the driver's checked recipe, and the native conversation a resume continues; for a connected
 * project's child, also its worktree's checkout.
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
        public bool $isConversationRequired,
    ) {}
}
