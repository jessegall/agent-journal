<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ConversationModeType;

/**
 * What a launch tells its caller: the request, the session and agent, the selection, whether the session is new,
 * the conversation mode and the program's arguments; the actual model is not reported by current adapters. It never
 * holds the launch token or the settings.
 */
final readonly class LaunchReceipt
{
    public const string ACTUAL_MODEL_NOT_REPORTED = 'not reported by this adapter';

    /**
     * @param  list<string>  $programArguments
     */
    public function __construct(
        public string $requestId,
        public string $sessionId,
        public string $agentId,
        public SelectedProgram $selection,
        public bool $newSession,
        public ConversationModeType $conversationMode,
        public string $actualModel,
        public array $programArguments,
    ) {}
}
