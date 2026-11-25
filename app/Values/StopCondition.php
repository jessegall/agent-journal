<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\AccessType;

/**
 * One protected command whose exit must be zero before a helper may finish: an absolute executable run with argv,
 * never a shell line, within its own time and output limits.
 */
final readonly class StopCondition
{
    public const string CLEAN_WORKTREE = 'clean-worktree';

    public const int DEFAULT_SECONDS = 10;

    public const int OUTPUT_BYTES = 65536;

    /**
     * @param  list<string>  $arguments
     * @param  list<AccessType>  $accessTypes
     */
    public function __construct(
        public string $key,
        public string $label,
        public string $executable,
        public array $arguments,
        public array $accessTypes,
        public string $directory,
        public int $timeoutSeconds,
        public int $outputBytes,
        public string $guidance,
    ) {}

    /**
     * A hash of everything the host runs for this condition, so its results name the definition they ran.
     */
    public function definitionHash(): string
    {
        return hash('sha256', json_encode([
            $this->key,
            $this->executable,
            $this->arguments,
            array_map(fn (AccessType $type): string => $type->value, $this->accessTypes),
            $this->directory,
            $this->timeoutSeconds,
            $this->outputBytes,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * The built-in check every writing helper must pass: no tracked or untracked change is left uncommitted.
     */
    public static function cleanWorktree(): self
    {
        return new self(
            self::CLEAN_WORKTREE,
            'Clean worktree',
            '/opt/journal/bin/journal-check',
            ['worktree-clean'],
            [
                AccessType::Read,
                AccessType::Execute,
            ],
            'workspace',
            self::DEFAULT_SECONDS,
            self::OUTPUT_BYTES,
            'Uncommitted work remains. Commit intended changes, then request stop again.',
        );
    }
}
