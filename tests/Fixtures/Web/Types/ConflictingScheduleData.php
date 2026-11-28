<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use App\Web\Attributes\Deferred;
use App\Web\Attributes\Optional as OptionalProp;
use Spatie\LaravelData\Data;

#[Deferred('books'), OptionalProp]
final class ConflictingScheduleData extends Data
{
    public function __construct(public readonly string $title) {}
}
