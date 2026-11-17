<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models\Shop\Calls;

use Illuminate\Database\Eloquent\Model;

final class Unguard
{
    public function open(): void
    {
        Model::unguard();
    }
}
