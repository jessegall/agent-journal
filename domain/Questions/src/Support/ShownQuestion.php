<?php

declare(strict_types=1);

namespace Domain\Questions\Support;

/**
 * A question as its sender and its target are shown it, with the answer once there is one.
 */
final readonly class ShownQuestion
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public string $id,
        public string $inboxId,
        public string $senderType,
        public string $senderId,
        public string $targetType,
        public string $targetId,
        public string $text,
        public string $type,
        public array $options,
        public string|null $answer,
        public string|null $answeredAt,
        public string $askedAt,
    ) {}
}
