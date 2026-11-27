<?php

declare(strict_types=1);

namespace App\Console\Support;

use App\Files\Contracts\Files;
use App\Values\FilePath;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * A generated PHP source as Pint writes it, so a generator's check compares what it would write with the file on disk.
 */
final readonly class PintFormatter
{
    public function __construct(private ProcessFactory $processes, private Files $files) {}

    public function formatted(string $source): string
    {
        return $this->files->scratch(function (FilePath $scratch) use ($source) {
            $this->files->write($scratch, $source);

            $this->processes->newPendingProcess()->path(base_path())->run([
                'vendor/bin/pint',
                $this->files->realPath($scratch),
            ]);

            return $this->files->read($scratch);
        }, '.php');
    }

    /**
     * Formats the files written at these paths from the project root in place.
     *
     * @param  list<string>  $paths
     */
    public function formatInPlace(array $paths): void
    {
        $this->processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', ...$paths]);
    }
}
