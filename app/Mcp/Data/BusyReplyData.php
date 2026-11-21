<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The journal's refusal of a call while it is busy: how many seconds to wait, when it says.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class BusyReplyData extends Data
{
    public function __construct(public readonly int|null $retryAfterSeconds = null) {}
}
