<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Enums\MessagePartType;

/**
 * One part of a delivery to an agent, in its place among the others: a text, or an attachment named by its id, the
 * digest of the version sent and its label. The agent reads an attachment through the journal, never from a path.
 */
interface MessagePart
{
    public function type(): MessagePartType;

    public function text(): string;

    public function attachmentId(): string;

    public function digest(): string;

    public function label(): string;

    public function isAttachment(): bool;

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
