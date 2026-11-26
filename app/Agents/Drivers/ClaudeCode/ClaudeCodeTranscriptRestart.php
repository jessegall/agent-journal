<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\AccountPlanPart;
use App\Agents\Values\RestartFile;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The transcript Claude Code writes once the conversation holds a turn, in the configuration folder the account names
 * or else in its home: a terminal healed after it exists resumes that conversation instead of starting it again.
 */
final readonly class ClaudeCodeTranscriptRestart implements AccountPlanPart
{
    /**
     * The variable naming the folder Claude Code keeps its configuration and transcripts in.
     */
    private const string CONFIGURATION_FOLDER = 'CLAUDE_CONFIG_DIR';

    /**
     * The transcript file the host waits on before it heals the terminal by resuming.
     */
    public function __invoke(DriverStart $start, DriverAccount $account): PlanAddition
    {
        return new PlanAddition(restartWhenFile: $this->transcriptOf($start, $account));
    }

    private function transcriptOf(DriverStart $start, DriverAccount $account): RestartFile
    {
        $configuration = '{folder:'.ClaudeCodeAccountHome::HOME_FOLDER.'}/.claude';

        foreach ($account->recipe->environment as $setting) {
            if ($setting->name === self::CONFIGURATION_FOLDER) {
                $configuration = $setting->settingText;
            }
        }

        return new RestartFile("{$configuration}/projects", "*{$start->sessionId}.jsonl");
    }
}
