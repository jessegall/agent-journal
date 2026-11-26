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

    /**
     * One line of prose above a tag that runs over several lines, which are the tag's and no prose.
     *
     * @var array{
     *     first: string,
     *     second: string,
     *     third: string,
     * }
     */
    public const array TAG_LINES = ['first' => 'a', 'second' => 'b', 'third' => 'c'];

    /**
     * Two lines of prose above an indented example,
     * which is no prose either.
     *
     *   composer test:run
     *   composer test:run -- tests/Architecture
     */
    public const string EXAMPLE = 'example';
}
