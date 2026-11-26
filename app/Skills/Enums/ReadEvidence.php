<?php

declare(strict_types=1);

namespace App\Skills\Enums;

/**
 * What proved that an agent read a whole skill: Claude's Skill tool returning it, or a read of the whole delivered
 * SKILL.md file.
 */
enum ReadEvidence: string
{
    case ClaudeSkillTool = 'claude-skill-tool';
    case FullFileRead = 'full-file-read';
}
