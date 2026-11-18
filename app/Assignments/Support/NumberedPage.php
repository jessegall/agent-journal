<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Exceptions\InvalidAssignmentPage;

/**
 * Which numbered page of a list to read, from 1, and how many entries a page holds, 1 to 100, 20 unless asked.
 */
final readonly class NumberedPage
{
    public const int LARGEST_SIZE = 100;

    /**
     * @throws InvalidAssignmentPage
     */
    public function __construct(
        public int $number = 1,
        public int $size = 20,
    ) {
        if ($number < 1) {
            throw InvalidAssignmentPage::forPageNumber($number);
        }

        if ($size < 1 || $size > self::LARGEST_SIZE) {
            throw InvalidAssignmentPage::forLimit($size);
        }
    }
}
