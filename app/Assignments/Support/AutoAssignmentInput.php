<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Exceptions\AutoAssignmentSizeInvalid;

/**
 * An auto-assignment as it is enabled or configured: whose it is, the pool it draws from and how many items of the type
 * the actor keeps in hand, 1 to 100.
 */
final readonly class AutoAssignmentInput
{
    public const int LARGEST_SIZE = 100;

    /**
     * @throws AutoAssignmentSizeInvalid
     */
    public function __construct(
        public AutoAssignmentKey $key,
        public PoolReference $pool,
        public int $size,
    ) {
        if ($size < 1 || $size > self::LARGEST_SIZE) {
            throw AutoAssignmentSizeInvalid::for($size, self::LARGEST_SIZE);
        }
    }
}
