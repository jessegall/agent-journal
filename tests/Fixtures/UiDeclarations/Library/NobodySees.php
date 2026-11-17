<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Core\Actors\Contracts\Actor;
use App\Core\Ui\Contracts\VisibilityCheck;

final class NobodySees implements VisibilityCheck
{
    public function allows(Actor $actor): bool
    {
        return false;
    }
}
