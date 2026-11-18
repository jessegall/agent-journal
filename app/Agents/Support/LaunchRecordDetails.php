<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchDisposition;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;

/**
 * One launch request as its readers see it: the agent, the selection, its origin and where it stands.
 */
final readonly class LaunchRecordDetails
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public string $program,
        public string $model,
        public ModelSelectionType $requestedModelType,
        public string|null $requestedModel,
        public ProgramSourceType $programSource,
        public LaunchOriginType $origin,
        public string|null $ownerReference,
        public ConversationModeType $conversationMode,
        public LaunchDisposition $disposition,
        public string|null $sessionId,
    ) {}
}
