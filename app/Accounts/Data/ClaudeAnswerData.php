<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What `claude -p --output-format json` prints, the two fields the check reads: whether the answer is an error,
 * taken as one when the driver does not say, and its result, which on an error is the provider's refusal.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ClaudeAnswerData extends Data
{
    public function __construct(
        public readonly bool $isError = true,
        public readonly string $result = '',
    ) {}
}
