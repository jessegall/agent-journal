<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What `claude -p --output-format json` prints, the one field the check reads: whether the answer is an error,
 * taken as one when the program does not say.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ClaudeAnswerData extends Data
{
    public function __construct(public readonly bool $isError = true) {}
}
