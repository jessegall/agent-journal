<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

enum ShelfState: string
{
    case Open = 'open';
    case Closed = 'closed';
}
