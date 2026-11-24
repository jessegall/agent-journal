<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

/**
 * How chat messages are drawn together: one author's messages within this many seconds of the last form one group.
 */
final readonly class ChatGrouping
{
    public const int WINDOW_SECONDS = 30;
}
