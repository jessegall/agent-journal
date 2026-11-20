<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

interface WorkRecordState
{
    public function workRecordType(): string;
}
