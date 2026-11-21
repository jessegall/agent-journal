<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\DriverSourceType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StartOriginType;
use Illuminate\Support\Carbon;

/**
 * One start request as its readers see it: the agent, the selection, its origin and where it stands; a refused one
 * names its reason code and when it was refused, and no session.
 */
final readonly class StartRecordDetails
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public string $driver,
        public string $model,
        public ModelSelectionType $requestedModelType,
        public string|null $requestedModel,
        public DriverSourceType $driverSource,
        public StartOriginType $origin,
        public string|null $ownerReference,
        public ConversationModeType $conversationMode,
        public StartDisposition $disposition,
        public string|null $sessionId,
        public string|null $refusalReason,
        public Carbon|null $refusedAt,
    ) {}
}
