<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\Actors\Support\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Commands\RevokeShare;
use Illuminate\Console\Command;

/**
 * The owner revokes a share or dismisses a proposal from the command line, under a request key.
 */
final class ShareRevokeCommand extends Command
{
    protected $signature = 'share:revoke {share : The id of the share} {--request-key= : Send again under the key a failed attempt printed}';

    protected $description = 'Revoke a share or dismiss a proposal';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $key = $owner->useRequestKey($this->option('request-key') === null ? null : (string) $this->option('request-key'));
        $summary = $commands->run(new RevokeShare((string) $this->argument('share'), $key));

        $this->line("Share {$summary->number} is {$summary->state->value}.");

        return self::SUCCESS;
    }
}
