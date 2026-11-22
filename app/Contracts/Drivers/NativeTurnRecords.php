<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * Records the native turns a session's prompts start, once per driver prompt id; the prompt's text is never kept.
 */
interface NativeTurnRecords
{
    public function recordPrompt(string $sessionId, int|null $generation, string|null $nativePromptId): void;
}
