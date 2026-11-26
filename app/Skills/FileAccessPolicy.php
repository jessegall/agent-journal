<?php

declare(strict_types=1);

namespace App\Skills;

use App\Access\Contracts\FileAccessPolicy as FileAccessPolicyContract;
use App\Files\Enums\FileAccess;
use App\Models\Agents\AgentRuntime;
use App\Values\AgentText;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Keeps each runtime's delivered skills its own. A host keeps a runtime's settings, its delivered skills among them,
 * in runtimes/<runtime id> under its state folder: an agent may neither read nor write another runtime's folder, and
 * never writes a SKILL.md in its own, which only the journal delivers.
 */
final readonly class FileAccessPolicy implements FileAccessPolicyContract
{
    private const string RUNTIME_FOLDER = '~(?:^|/)runtimes/([0-9a-hjkmnp-tv-z]{26})(?:/|$)~i';

    private const string SKILL_FILE = 'SKILL.md';

    public function refusalFor(string $sessionId, FileAccess $access, string $path): Option
    {
        if (preg_match(self::RUNTIME_FOLDER, $path, $folder) !== 1) {
            return None::create();
        }

        if (strtolower($folder[1]) !== AgentRuntime::findForSession($sessionId)?->id) {
            return Some::create(AgentText::of('core.drivers.other_runtime'));
        }

        if ($access === FileAccess::Write && basename($path) === self::SKILL_FILE) {
            return Some::create(AgentText::of('core.drivers.delivered_skill'));
        }

        return None::create();
    }
}
