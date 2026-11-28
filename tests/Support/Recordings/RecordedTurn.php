<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use Closure;
use Illuminate\Support\Str;
use Tests\Support\Assertions\Assert;

final readonly class RecordedTurn
{
    public function __construct(public string $message, public string $keys, private string $answer) {}

    /** @param list<string>|null $rows */
    public function answeredIn(array|null $rows): bool
    {
        return str_contains(Str::squish(implode("\n", $rows ?? [])), Str::squish($this->answer));
    }

    public function answeredOn(string $name): Closure
    {
        return fn (Assert $journal) => $journal->where("hostProcesses.{$name}.rows", $this->answeredIn(...));
    }
}
