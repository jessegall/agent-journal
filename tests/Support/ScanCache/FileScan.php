<?php

declare(strict_types=1);

namespace Tests\Support\ScanCache;

use Tests\Architecture\Support\ParsedFile;

/**
 * One architecture rule's look at one file: what it finds there depends only on that file, so the finding can be kept
 * for as long as the file and the rule stay the same.
 *
 * @template TFinding
 */
interface FileScan
{
    /**
     * A name for the rule and the version of its logic; raise the version when the rule changes what it finds.
     */
    public function key(): string;

    /**
     * @return list<TFinding> plain values that survive serialize and unserialize
     */
    public function findingsIn(ParsedFile $file): array;
}
