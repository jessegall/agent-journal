<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Core\Ui\Contracts\CountReader;

final class BookCount implements CountReader
{
    public function count(): int
    {
        return 3;
    }
}
