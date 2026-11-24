<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * Records the native turns a session's prompts start, once per driver prompt id; the prompt's text is never kept.
 */
interface NativeTurnRecords
{
    /**
     * Keeps the driver's own id of the prompt the session just submitted in the generation, so its turn can be matched
     * later.
     */
    public function recordPrompt(string $sessionId, int|null $generation, string|null $nativePromptId): void;
}
