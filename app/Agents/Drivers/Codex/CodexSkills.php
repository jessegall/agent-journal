<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\CodexTool;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Enums\SkillReload;
use App\Support\Inputs\Values\ToolResult;
use App\Values\ProvenSkillRead;
use App\Values\SkillDelivery;
use App\Values\SkillKey;

/**
 * Codex 0.165.0 finds a session's skills in the skills folder of its isolated CODEX_HOME, which is the start's settings
 * folder, so the host writes them there and adds no argument. It lists them when a turn's process starts. It has no
 * skill tool and reads files through its shell, so a shell cat or sed -n of a whole SKILL.md, or skill:show, proves a
 * skill read; sed -n of a range of lines or head proves none.
 */
final readonly class CodexSkills implements DriverSkills
{
    public const string FOLDER = 'skills';

    /**
     * A shell line that prints one file whole with sed -n, every line from the first to the last, its path in the
     * group path.
     */
    private const string WHOLE_SED = '~^sed\s+-n\s+(?:\'1,\$p\'|"1,\$p"|\'p\'|"p"|p)\s+'
        .'(?<quote>[\'"]?)(?<path>\S+)(?P=quote)\s*$~';

    public function skillProtocol(): string
    {
        return DefaultDrivers::CODEX;
    }

    public function skillFile(SkillKey $key): string
    {
        return "{$key->key}/SKILL.md";
    }

    public function supportFiles(): array
    {
        return [];
    }

    public function delivery(): SkillDelivery
    {
        return new SkillDelivery(self::FOLDER, []);
    }

    public function reloadMode(): SkillReload
    {
        return SkillReload::NewSession;
    }

    public function provenRead(ToolResult $call, string $runtimeId): ProvenSkillRead|null
    {
        if ($call->toolName !== CodexTool::Bash->value) {
            return null;
        }

        $line = (string) $call->arguments->textArgument('command');

        return ProvenSkillRead::byShellLine($line, [ProvenSkillRead::WHOLE_CAT, self::WHOLE_SED], $runtimeId);
    }
}
