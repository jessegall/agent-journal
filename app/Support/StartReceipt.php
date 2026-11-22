<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ConversationModeType;
use App\Values\SelectedDriver;

/**
 * What a start tells its caller: the request, the session and agent, the selection, whether the session is new,
 * the conversation mode and the driver's arguments; the actual model is not reported by current adapters. It never
 * holds the start token or the settings.
 */
final readonly class StartReceipt
{
    public const string ACTUAL_MODEL_NOT_REPORTED = 'not reported by this adapter';

    /**
     * @param  list<string>  $driverArguments
     */
    public function __construct(
        public string $requestId,
        public string $sessionId,
        public string $agentId,
        public SelectedDriver $selection,
        public bool $newSession,
        public ConversationModeType $conversationMode,
        public string $actualModel,
        public array $driverArguments,
    ) {}
}
