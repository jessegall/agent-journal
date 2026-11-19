<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\ListItems;
use App\Processes\Values\Grammar\ListReading;

/**
 * Starts a list with no item read yet, so no ; may come first.
 */
final readonly class StartList implements Pipe
{
    public function handle(ListReading $reading): ListItems
    {
        return new ListItems($reading, false);
    }
}
