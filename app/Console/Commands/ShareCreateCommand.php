<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\CreateShare\CreateShareCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\SharePreview;
use App\Support\ConsoleOwner;
use App\Support\ShareDuration;
use Illuminate\Console\Command;

/**
 * The owner confirms a saved preview into a share from the command line, under a request key, and prints its number
 * and state; the address is printed only by share:url.
 */
final class ShareCreateCommand extends Command
{
    protected $signature = 'share:create {preview : The id of the saved preview} {--minutes= : How long the share lasts; seven days when left out} {--request-key= : Send again under the key a failed attempt printed}';

    protected $description = 'Share a record from a saved preview';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        $key = $owner->useRequestKey(
            $this->option('request-key') === null ? null : (string) $this->option('request-key'),
        );

        $preview = SharePreview::of((string) $this->argument('preview'));
        $minutes = $this->option('minutes') === null ? ShareDuration::STANDARD_MINUTES : (int) $this->option('minutes');
        $summary = $commands->run(new CreateShareCommand($preview->id, $preview->checksum, $minutes, $key));

        $this->line("Share {$summary->number} ({$summary->shareId}) is {$summary->state->value}.");

        return self::SUCCESS;
    }
}
