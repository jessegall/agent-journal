<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ResultPublisher;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Exceptions\ProcessesServiceMissing;
use Illuminate\Contracts\Container\Container;

/**
 * The services every shell command goes through: parser, classifier, admission, result publisher and the
 * receipt gate. Start-up fails by name when one is not bound; there is no fallback that lets a command through.
 */
final readonly class RequiredServices
{
    private const array SERVICES = [
        ShellCommandParser::class,
        CommandClassifier::class,
        ShellAdmission::class,
        ResultPublisher::class,
        ResultReceipts::class,
    ];

    /**
     * @throws ProcessesServiceMissing
     */
    public static function check(Container $container): void
    {
        foreach (self::SERVICES as $service) {
            if (! $container->bound($service)) {
                throw ProcessesServiceMissing::for($service);
            }
        }
    }
}
