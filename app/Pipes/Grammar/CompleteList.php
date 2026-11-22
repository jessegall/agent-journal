<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\ListItems;
use App\Support\Grammar\ListRead;

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
