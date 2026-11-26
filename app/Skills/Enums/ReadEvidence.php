<?php

declare(strict_types=1);

namespace App\Skills\Enums;

/**
 * What proved that an agent read a whole skill: Claude's Skill tool returning it, a read of the whole delivered
 * SKILL.md file, or a successful php artisan skill:show, which prints the whole rendered skill.
 */
enum ReadEvidence: string
{
    case ClaudeSkillTool = 'claude-skill-tool';
    case FullFileRead = 'full-file-read';
    case SkillShow = 'skill-show';
}
