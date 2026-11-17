<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Assignments\Exceptions\InvalidAssignmentPage;

/**
 * Which page of an id-ordered list to read, such as the record ids an actor holds or the actors work may go to: those
 * after an id, or from the start, at most 100 at a time.
 */
final readonly class Page
{
    public const int LARGEST_LIMIT = 100;

    /**
     * @throws InvalidAssignmentPage
     */
    public function __construct(
        public int|null $afterId = null,
        public int $limit = 20,
    ) {
        if ($limit < 1 || $limit > self::LARGEST_LIMIT) {
            throw InvalidAssignmentPage::forLimit($limit);
        }

        if ($afterId !== null && $afterId < 1) {
            throw InvalidAssignmentPage::forCursor($afterId);
        }
    }
}
