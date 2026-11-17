<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use Spatie\LaravelData\Data;

/**
 * What the journal hands back to a program's hook: its standard output, standard error and exit code.
 */
final readonly class ProgramReply
{
    public function __construct(
        public string $stdout,
        public string $stderr,
        public int $exitCode,
    ) {}

    public static function emptyObject(): self
    {
        return new self('{}', '', 0);
    }

    public static function json(Data $body): self
    {
        return new self(json_encode((object) $body->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), '', 0);
    }
}
