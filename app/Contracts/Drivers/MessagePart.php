<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * One part of a delivery to an agent, in its place among the others: a text, or an attachment named by its id, the
 * digest of the version sent and its label. The agent reads an attachment through the journal, never from a path.
 */
interface MessagePart
{
    /**
     * The bytes of text the part carries, as the delivery budget counts them.
     */
    public function textBytes(): int;

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
