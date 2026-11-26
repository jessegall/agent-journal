<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Values\SelectedDriver;

/**
 * What an owner learns of a start for its work: the request as the start's reference, the selection, whether the
 * session is new, the conversation it asked for, where it runs and the actual model as the adapter reports it. It
 * holds no native id, session id or credential.
 */
final readonly class OwnerStartReceipt
{
    public function __construct(
        public string $startReference,
        public SelectedDriver $selection,
        public bool $isNewSession,
        public ConversationModeType $conversationMode,
        public ExecutionModeType $executionMode,
        public string|null $configurationHash,
        public string $actualModel,
    ) {}

    /**
     * The owner's part of Core's receipt for the start, with where the start runs and its configuration.
     */
    public static function ofStart(
        StartReceipt $receipt,
        ExecutionModeType $executionMode,
        string|null $configurationHash,
    ): self {
        return new self(
            $receipt->requestId,
            $receipt->selection,
            $receipt->isNewSession,
            $receipt->conversationMode,
            $executionMode,
            $configurationHash,
            $receipt->actualModel,
        );
    }
}
