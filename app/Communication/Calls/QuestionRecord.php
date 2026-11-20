<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\Records\Support\RecordIdentity;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

final class QuestionRecord extends Data
{
    public function __construct(
        #[Max(100)]
        public readonly string $type,
        #[Ulid]
        public readonly string $id,
    ) {}

    public function identity(): RecordIdentity
    {
        return new RecordIdentity($this->type, strtolower($this->id));
    }
}
