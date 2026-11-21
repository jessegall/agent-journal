<?php

declare(strict_types=1);

namespace App\Ui\Layout;

/**
 * The ceilings every declared layout stays under, so one reader can never send an unbounded page.
 */
final class LayoutLimits
{
    /**
     * The deepest a part may sit below the layout's root.
     */
    public const int DEPTH_LIMIT = 12;

    /**
     * The most parts one layout holds, its root among them.
     */
    public const int PART_LIMIT = 500;

    /**
     * The most rows one collection holds; a longer list is paged by its reader.
     */
    public const int ROW_LIMIT = 100;
}
