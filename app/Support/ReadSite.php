<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Where in the application a read was made, and the read's shape with its values left out, so the same read run
 * over and over from one place is recognised however its values differ.
 */
final readonly class ReadSite
{
    private function __construct(public string $callSite, public string $shape) {}

    /**
     * The read made now, by the first frame of application code that asked for it; none when no application code
     * asked, as in a test or the framework itself.
     */
    public static function ofQuery(string $connection, string $query, string $basePath): self|null
    {
        foreach (debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 60) as $frame) {
            $file = $frame['file'] ?? '';

            $isApplicationCode = (str_starts_with($file, $basePath.'/app/') || str_starts_with(
                $file,
                $basePath.'/domain/',
            ))
                && ! str_starts_with($file, $basePath.'/app/Reads/');

            if ($isApplicationCode) {
                $shape = (string) preg_replace(['/\s+/', '/\((\?\s*,\s*)+\?\)/'], [' ', '(?)'], trim($query));

                return new self(
                    substr($file, strlen($basePath) + 1).':'.($frame['line'] ?? 0),
                    "{$connection}|{$shape}",
                );
            }
        }

        return null;
    }

    /**
     * The read from this place, whatever its values.
     */
    public function key(): string
    {
        return "{$this->callSite}|{$this->shape}";
    }
}
