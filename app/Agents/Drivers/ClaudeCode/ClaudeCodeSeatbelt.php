<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\AccountPlanPart;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\Values\PlanFile;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The Seatbelt profile one turn and every tool it starts run under: no other workspace's history in the account
 * folder, no process or signal outside the turn, which Claude Code's own sandbox does not close.
 */
final readonly class ClaudeCodeSeatbelt implements AccountPlanPart
{
    public const string NAME = 'session.sb';

    /**
     * The turn's Seatbelt profile, named for the host to apply.
     *
     * @throws ProfileRefused
     */
    public function __invoke(DriverStart $start, DriverAccount $account): PlanAddition
    {
        $folder = $account->folder
            ?? throw ProfileRefused::unresolvedSetting('no account folder for the Seatbelt profile');

        return new PlanAddition(
            files: [new PlanFile(self::NAME, $this->profileOf($folder, $start->workFolder))],
            seatbelt: self::NAME,
        );
    }

    /**
     * @throws ProfileRefused
     */
    private function profileOf(string $accountFolder, string $workFolder): string
    {
        foreach ([
            $accountFolder,
            $workFolder,
        ] as $folder) {
            if (! str_starts_with($folder, '/') || strpbrk($folder, "\"\\\n") !== false) {
                throw ProfileRefused::unresolvedSetting("the Seatbelt folder {$folder} is not a plain absolute path");
            }
        }

        $history = rtrim($accountFolder, '/').'/projects';

        $ownHistory = $history.'/'.strtr(rtrim($workFolder, '/'), ['/' => '-', '.' => '-']);

        return <<<SB
            (version 1)
            (allow default)
            (deny file-read* file-write* (subpath "{$history}"))
            (allow file-read* file-write* (subpath "{$ownHistory}"))
            (deny process-info*)
            (allow process-info* (target same-sandbox))
            (deny signal)
            (allow signal (target same-sandbox))

            SB;
    }
}
