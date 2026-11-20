<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

interface RefusalDetails
{
    /**
     * @return array<string, mixed>
     */
    public function refusalDetails(): array;
}
