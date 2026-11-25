<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverSourceType;
use App\Enums\Sessions\ModelSelectionType;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use Carbon\CarbonImmutable;

/**
 * One start request as its readers see it: the agent, the selection, its origin and where it stands; a refused one
 * names its reason code and when it was refused, and no session.
 */
final readonly class SessionRequestDetails
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
        public CarbonImmutable|null $refusedAt,
    ) {}
}
