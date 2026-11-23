<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\FileAccessPolicy;
use App\Enums\FileAccess;
use App\Models\Agents\AgentRuntime;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Keeps each runtime's delivered skills its own. A host keeps a runtime's settings, its delivered skills among them,
 * in runtimes/<runtime id> under its state folder: an agent may neither read nor write another runtime's folder, and
 * never writes a SKILL.md in its own, which only the journal delivers.
 */
final readonly class DeliveredSkillsAccess implements FileAccessPolicy
{
    private const string RUNTIME_FOLDER = '~(?:^|/)runtimes/([0-9a-hjkmnp-tv-z]{26})(?:/|$)~i';

    private const string SKILL_FILE = 'SKILL.md';

    public const string OTHER_RUNTIME = 'That file belongs to another agent\'s start: only that agent may read or '
        .'change it.';

    public const string DELIVERED_SKILL = 'Your delivered skills are read-only: the journal writes them. Ask for a '
        .'change to the skill through the journal instead.';

    public function refusalFor(string $sessionId, FileAccess $access, string $path): Option
    {
        if (preg_match(self::RUNTIME_FOLDER, $path, $folder) !== 1) {
            return None::create();
        }

        if (strtolower($folder[1]) !== AgentRuntime::ofSession($sessionId)?->id) {
            return Some::create(self::OTHER_RUNTIME);
        }

        if ($access === FileAccess::Write && basename($path) === self::SKILL_FILE) {
            return Some::create(self::DELIVERED_SKILL);
        }

        return None::create();
    }
}
