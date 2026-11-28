<?php

declare(strict_types=1);

namespace App\Values;

use App\Skills\Enums\ReadEvidence;

/**
 * A read of one skill whole that a driver's finished tool call proves; which calls prove one is each driver's to say.
 * What every driver shares is read here: a SKILL.md of the session's own runtime folder, a shell line that prints such
 * a file whole, and a successful php artisan skill:show of the key. A listing, a partial read or a file of another
 * folder proves nothing.
 */
final readonly class ProvenSkillRead
{
    private const string KEY = '[a-z0-9]+(?:-[a-z0-9]+)*';

    /**
     * A shell line that prints one file whole with cat, its path in the group path.
     */
    public const string WHOLE_CAT = '~^cat\s+(?<quote>[\'"]?)(?<path>\S+)(?P=quote)\s*$~';

    public const string SKILL_SHOW = '~^php\s+artisan\s+skill:show\s+('.self::KEY.')\s*$~';

    private const string DOTTED_SEGMENT = '~(?:^|/)\.\.?(?:/|$)~';

    private function __construct(
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}

    /**
     * The read a driver's own skill tool proves, by the key it loaded.
     */
    public static function bySkillTool(string $skillKey): self
    {
        return new self($skillKey, ReadEvidence::ClaudeSkillTool);
    }

    /**
     * The skill a path names when it is a SKILL.md inside the folder of this runtime, written without dotted segments.
     */
    public static function inFile(string $path, string $runtimeId): self|null
    {
        if (preg_match(self::DOTTED_SEGMENT, $path) === 1) {
            return null;
        }

        $skillFile = '~(?:^|/)runtimes/'.preg_quote($runtimeId, '~').'/(?:[^/]+/)*skills/('.self::KEY.')/SKILL\.md$~';

        if (preg_match($skillFile, $path, $match) === 1) {
            return new self($match[1], ReadEvidence::FullFileRead);
        }

        return null;
    }

    /**
     * The read a shell line proves: skill:show of a key, or one of the driver's whole-file reads, each a pattern whose
     * group path names the file, of a SKILL.md of this runtime.
     *
     * @param  list<string>  $wholeReads
     */
    public static function byShellLine(string $line, array $wholeReads, string $runtimeId): self|null
    {
        $command = trim($line);

        if (preg_match(self::SKILL_SHOW, $command, $match) === 1) {
            return new self($match[1], ReadEvidence::SkillShow);
        }

        foreach ($wholeReads as $wholeRead) {
            if (preg_match($wholeRead, $command, $match) === 1) {
                return self::inFile($match['path'], $runtimeId);
            }
        }

        return null;
    }
}
