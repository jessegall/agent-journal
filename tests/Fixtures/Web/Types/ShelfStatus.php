<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

enum ShelfStatus: string
{
    case Open = 'open';
    case Closed = 'closed';
}
