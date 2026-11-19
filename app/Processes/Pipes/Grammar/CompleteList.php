<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\ListItems;
use App\Processes\Values\Grammar\ListRead;

/**
 * Hands on the list read into its parent node.
 */
final readonly class CompleteList implements Pipe
{
    public function handle(ListItems $items): ListRead
    {
        return new ListRead($items->reading->context, $items->reading->parent);
    }
}
