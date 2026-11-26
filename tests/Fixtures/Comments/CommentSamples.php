<?php

declare(strict_types=1);

namespace Tests\Fixtures\Comments;

/**
 * The samples the comments check judges: each refused comment is one rule's case, each kept one a near miss.
 */
final class CommentSamples
{
    /**
     * The value previously kept in the cache.
     */
    public const string HISTORY = 'history';

    /**
     * First, the rows are read. Then we sort them.
     */
    public const string NARRATION = 'narration';

    /**
     * The magic number of the protocol.
     */
    public const string POETRY = 'poetry';

    /**
     * One line.
     * Two lines.
     * Three lines.
     * Four lines.
     */
    public const string LONG = 'long';

    /**
     * The oldest first, as the reader asks, and a name such as "magic" quoted: nothing is refused here.
     */
    public const string KEPT = 'kept';
}
