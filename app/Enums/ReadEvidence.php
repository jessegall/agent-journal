<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What proved that an agent read a whole skill: Claude's Skill tool returning it, a read of the whole delivered
 * SKILL.md file, or the journal's own skill show.
 */
enum ReadEvidence: string
{
    case ClaudeSkillTool = 'claude-skill-tool';
    case FullFileRead = 'full-file-read';
    case JournalShow = 'journal-show';
}
