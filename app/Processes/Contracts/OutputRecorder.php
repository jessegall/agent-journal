<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Models\PartRun;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\OutputPosition;
use App\Processes\Values\PartEnd;

/**
 * Keeps every byte a part writes, from byte zero (doc 21 revision 6, sections 54 and 55).
 */
interface OutputRecorder
{
    public function append(CapturedChunk $chunk): OutputPosition;

    public function finish(PartRun $part, PartEnd $end): void;
}
