<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\ConsoleOwner;
use App\Support\ShareLinkResolver;
use Illuminate\Console\Command;

/**
 * The owner's deliberate request for a share's public address: printed on this call alone, and only for an active,
 * unexpired share the owner granted.
 */
final class ShareUrlCommand extends Command
{
    protected $signature = 'share:url {share : The id of the share}';

    protected $description = 'Print the public address of an active share';

    public function handle(ConsoleOwner $owner, ShareLinkResolver $links): int
    {
        $url = $links->linkFor($owner->actAsOwner(), (string) $this->argument('share'));

        if ($url->isEmpty()) {
            $this->error('This share has no address now: it is not active, has expired, or was granted by another owner.');

            return self::FAILURE;
        }

        $this->line($url->get());

        return self::SUCCESS;
    }
}
