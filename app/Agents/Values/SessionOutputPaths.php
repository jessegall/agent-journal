<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Programs\Enums\HookProgram;

/**
 * The exact files one native conversation of a session may read back: its transcript and, for a program that saves
 * large tool outputs beside it, that conversation's own output folder. Never a parent folder of other sessions.
 */
final readonly class SessionOutputPaths
{
    private const string DOT_SEGMENT = '#/\.\.?(/|$)#';

    public function __construct(
        public string $transcriptPath,
        public string|null $outputDirectory,
    ) {}

    /**
     * The paths of the conversation the host named, kept only when its transcript lies inside the start's account
     * folder and names that conversation; none for any other path, so a session never gains another's history.
     */
    public static function verified(
        HookProgram $program,
        string $accountDirectory,
        string $nativeId,
        string $transcriptPath,
    ): self|null {
        $root = rtrim($accountDirectory, '/').'/';
        $isInside = str_starts_with($transcriptPath, $root) && preg_match(self::DOT_SEGMENT, $transcriptPath) === 0;

        if (! $isInside || ! $program->namesTranscriptOf(basename($transcriptPath), $nativeId)) {
            return null;
        }

        $outputDirectory = $program->keepsOutputsBesideTranscript() ? dirname($transcriptPath).'/'.$nativeId : null;

        return new self($transcriptPath, $outputDirectory);
    }

    /**
     * Whether the path is the transcript itself, the conversation's own output folder or lies inside it.
     */
    public function contains(string $path): bool
    {
        if (preg_match(self::DOT_SEGMENT, $path) === 1) {
            return false;
        }

        return $path === $this->transcriptPath
            || $path === $this->outputDirectory
            || ($this->outputDirectory !== null && str_starts_with($path, $this->outputDirectory.'/'));
    }
}
