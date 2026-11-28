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
 * Codex finds a session's skills in the skills folder of its CODEX_HOME, the start's settings folder, at each turn's
 * start. It reads through its shell: a cat or sed -n of a whole SKILL.md, or skill:show, proves a read; a range does not.
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
