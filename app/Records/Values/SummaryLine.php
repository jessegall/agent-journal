<?php

declare(strict_types=1);

namespace App\Records\Values;

/**
 * One line under a summary's title, kept under its key, such as who holds a task, with where it stands when the line is
 * a step.
 */
final readonly class SummaryLine
{
    public function __construct(public string $key, public string $text, public RecordStanding|null $standing = null) {}
}
