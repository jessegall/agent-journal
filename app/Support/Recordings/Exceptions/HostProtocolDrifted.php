<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * The generated host protocol code differs from protocol/host.json, so a recording would be judged by old readers.
 */
final class HostProtocolDrifted extends RuntimeException
{
    /**
     * @param  list<string>  $files
     */
    public static function naming(array $files): self
    {
        $named = implode(', ', $files);

        $generate = 'run php artisan journal:host-protocol first';

        return new self("The generated host protocol differs in {$named}: {$generate}.");
    }
}
