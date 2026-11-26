<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Relay\HookRelay;
use App\Agents\Relay\RelaySettings;
use App\Sessions\Contracts\SessionTokenSource;
use App\Sessions\OfflineReplySeal;
use App\Sessions\StartEnvironment;
use Illuminate\Console\Command;

/**
 * The command a started driver's isolated settings run for every hook: it reads the payload on standard input.
 */
final class RelayHookCommand extends Command
{
    protected $signature = 'hooks:relay {driver}';

    protected $description = 'Pass one native hook call to the journal and print its reply';

    public function handle(
        HookRelay $relay,
        SessionTokenSource $credentials,
        StartEnvironment $start,
        OfflineReplySeal $seal,
    ): int {
        $settings = RelaySettings::forStart($credentials->forThisStart(), $start, $seal);
        $driver = (string) $this->argument('driver');
        $reply = $relay->relay($driver, (string) stream_get_contents(STDIN), $settings);

        $this->output->write($reply->stdout);
        fwrite(STDERR, $reply->stderr);

        return $reply->exitCode;
    }
}
