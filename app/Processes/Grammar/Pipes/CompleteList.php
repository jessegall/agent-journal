<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\ListItems;
use App\Processes\Grammar\ListRead;

/**
 * Hands on the list read into its parent node.
 */
final readonly class CompleteList implements Pipe
{
    public function handle(ListItems $cursor): ListRead
    {
        return new ListRead($cursor->toParse->context, $cursor->toParse->parent);
    }
}
