<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Contracts\Actor;
use App\Contracts\VisibilityCheck;

final class NobodySees implements VisibilityCheck
{
    public function allows(Actor $actor): bool
    {
        return false;
    }
}
