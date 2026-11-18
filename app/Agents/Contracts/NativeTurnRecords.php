<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * Records the native turns a session's prompts start, once per program prompt id; the prompt's text is never kept.
 */
interface NativeTurnRecords
{
    public function recordPrompt(string $sessionId, int|null $generation, string|null $nativePromptId): void;
}
