<?php

declare(strict_types=1);

namespace App\Hooks\Console;

use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\Hooks\Enums\HookProgram;
use App\Hooks\Relay\HookRelay;
use App\Hooks\Relay\RelaySettings;
use Illuminate\Console\Command;

/**
 * The command a launched program's isolated settings run for every hook: it reads the payload on standard input.
 */
final class RelayHookCommand extends Command
{
    protected $signature = 'hooks:relay {program}';

    protected $description = 'Pass one native hook call to the journal and print its reply';

    public function handle(HookRelay $relay, LaunchCredentialSource $credentials): int
    {
        $settings = RelaySettings::forLaunch($credentials->forThisLaunch(), array_filter(getenv(), 'is_string'));
        $reply = $relay->relay(HookProgram::from((string) $this->argument('program')), (string) stream_get_contents(STDIN), $settings);

        $this->output->write($reply->stdout);
        fwrite(STDERR, $reply->stderr);

        return $reply->exitCode;
    }
}
