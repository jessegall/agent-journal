<?php

declare(strict_types=1);

namespace App\Hooks\Console;

use App\AgentRequests\Contracts\StartTokenSource;
use App\AgentRequests\Support\StartEnvironment;
use App\Agents\Support\OfflineReplySeal;
use App\Hooks\Relay\HookRelay;
use App\Hooks\Relay\RelaySettings;
use App\Programs\Enums\HookProgram;
use Illuminate\Console\Command;

/**
 * The command a started program's isolated settings run for every hook: it reads the payload on standard input.
 */
final class RelayHookCommand extends Command
{
    protected $signature = 'hooks:relay {program}';

    protected $description = 'Pass one native hook call to the journal and print its reply';

    public function handle(
        HookRelay $relay,
        StartTokenSource $credentials,
        StartEnvironment $start,
        OfflineReplySeal $seal,
    ): int {
        $settings = RelaySettings::forStart($credentials->forThisStart(), $start, $seal);
        $program = HookProgram::from((string) $this->argument('program'));
        $reply = $relay->relay($program, (string) stream_get_contents(STDIN), $settings);

        $this->output->write($reply->stdout);
        fwrite(STDERR, $reply->stderr);

        return $reply->exitCode;
    }
}
