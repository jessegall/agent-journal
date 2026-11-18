<?php

declare(strict_types=1);

namespace App\Skills\Data;

use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a skill write answers over MCP: the request id, the saved revision and the skill's status lines. Publication
 * is always pending: a write never says an agent loaded it.
 */
#[MapOutputName(SnakeCaseMapper::class)]
final class SkillWriteReceipt extends Data
{
    /**
     * @param  list<string>  $status
     */
    public function __construct(
        public readonly string $requestId,
        public readonly string $skillId,
        public readonly int $number,
        public readonly string $key,
        public readonly int $revision,
        public readonly array $status,
        public readonly string $publication = 'pending',
    ) {}
}
