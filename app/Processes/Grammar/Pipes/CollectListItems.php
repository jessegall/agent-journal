<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\ListItems;
use App\Processes\Grammar\UnparsedList;

/**
 * Starts a list with no item read yet, so no ; may come first.
 */
final readonly class CollectListItems implements Pipe
{
    public function handle(UnparsedList $toParse): ListItems
    {
        return new ListItems($toParse, false);
    }
}
