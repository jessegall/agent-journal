<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\ListItems;
use App\Support\Grammar\UnparsedList;

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
