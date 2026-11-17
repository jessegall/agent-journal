<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

/**
 * The JSON a Claude Code hook sends on standard input. Fields that belong to some events only are Optional.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ClaudeCodePayload extends Data
{
    /**
     * @param  array<string, mixed>|Optional  $toolInput
     * @param  array<string, mixed>|Optional  $toolResponse
     */
    public function __construct(
        public readonly string $hookEventName,
        public readonly string $sessionId,
        public readonly string|Optional $source = new Optional,
        public readonly string|Optional $prompt = new Optional,
        public readonly string|Optional $toolName = new Optional,
        public readonly array|Optional $toolInput = new Optional,
        public readonly array|Optional $toolResponse = new Optional,
        public readonly bool|Optional $stopHookActive = new Optional,
        public readonly string|Optional $reason = new Optional,
    ) {}
}
