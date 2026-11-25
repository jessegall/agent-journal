<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use Spatie\LaravelData\Data;

final class RecordCommented extends Data
{
    public function __construct(public string $commentId) {}
}
