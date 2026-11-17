<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

/**
 * The files one edit changes, in the order the program changes them.
 */
final readonly class FileChanges
{
    /**
     * @param  list<FileChange>  $changes
     */
    public function __construct(public array $changes) {}
}
