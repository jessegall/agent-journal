<?php

declare(strict_types=1);

namespace App\Enums\Engine;

/**
 * How a read chose its rows: the default newest rows, a named limit, every row for a reason, or in key batches.
 */
enum ReadMode: string
{
    case Default = 'default';
    case Limited = 'limited';
    case Unbounded = 'unbounded';
    case Chunked = 'chunked';

    /**
     * Whether a read in this mode may take more rows than the largest page.
     */
    public function mayExceedPage(): bool
    {
        return $this !== self::Default;
    }
}
