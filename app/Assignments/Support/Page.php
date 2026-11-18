<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Exceptions\InvalidAssignmentPage;
use Illuminate\Support\Str;

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
        public string|null $afterId = null,
        public int $limit = 20,
    ) {
        if ($limit < 1 || $limit > self::LARGEST_LIMIT) {
            throw InvalidAssignmentPage::forLimit($limit);
        }

        if ($afterId !== null && ! Str::isUlid($afterId)) {
            throw InvalidAssignmentPage::forCursor($afterId);
        }
    }
}
