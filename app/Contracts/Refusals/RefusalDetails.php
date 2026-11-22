<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

interface RefusalDetails
{
    /**
     * @return array<string, mixed>
     */
    public function refusalDetails(): array;
}
