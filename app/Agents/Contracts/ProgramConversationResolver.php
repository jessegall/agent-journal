<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\ProgramConversationSummary;
use App\Programs\Enums\HookProgram;

/**
 * The native conversations an agent's starts entered for one program and context, newest visit first, at most 20.
 */
interface ProgramConversationResolver
{
    public const int MOST_CONVERSATIONS = 20;

    /**
     * @return list<ProgramConversationSummary>
     */
    public function conversations(string $agentId, HookProgram $program, string|null $contextReference): array;
}
