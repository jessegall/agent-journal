<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\UnsupportedKeyword;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Grammar\CommandReading;

/**
 * if, while, until, for, select, case and coproc are not supported: read past each as one Unsupported node.
 */
final readonly class UnsupportedKeywordReader implements CommandReader
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    public function reads(TokenCursor $cursor): bool
    {
        return UnsupportedKeyword::startsAt($cursor);
    }

    public function read(CommandReading $reading): int
    {
        $keyword = UnsupportedKeyword::at($reading->cursor());
        $reason = "The shell construct '{$keyword->value}' is not supported.";

        return $this->unsupported->skip($reading->context, $reason, $keyword->terminator());
    }
}
