<?php

declare(strict_types=1);

namespace App\Support\Logging;

use Illuminate\Log\Logger;
use Monolog\Logger as Monolog;

/**
 * The tap every log channel runs: it adds the install-secret redaction to the channel's logger.
 */
final readonly class InstallSecretRedactionTap
{
    public function __invoke(Logger $logger): void
    {
        $monolog = $logger->getLogger();

        if ($monolog instanceof Monolog) {
            $monolog->pushProcessor(new InstallSecretRedaction());
        }
    }
}
