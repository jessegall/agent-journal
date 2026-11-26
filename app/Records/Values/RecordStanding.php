<?php

declare(strict_types=1);

namespace App\Records\Values;

use App\Processes\Enums\Tone;

/**
 * Where a record or one of its steps stands, as one word in a tone, such as Blocked in warn.
 */
final readonly class RecordStanding
{
    public function __construct(public string $word, public Tone $tone) {}
}
